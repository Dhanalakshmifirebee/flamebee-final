const restaurantController = require('../model/restaurantSchema')
const responseController = require('../model/responseSchema')
const adminController = require('../model/adminSchema')
const jwt = require('jsonwebtoken')
const geolib = require('geolib')


const image = (req,res)=>{
    try{
        req.body.image = `http://192.168.0.112:8613/uploads/${req.file.filename}`
        console.log(req.body)
        restaurantController.image.create(req.body,(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data}) 
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

// Restaurant

const createRestaurant = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        restaurantController.restaurant.countDocuments({restaurantEmail:req.body.restaurantEmail},(err,data)=>{
            if(data==0){
                req.body.restaurantOwnerId = verifyId
                restaurantController.restaurant.create(req.body,(err,data1)=>{
                    if(err) throw err
                    res.status(200).send({message:"Restaurant created Successfully",data1})
                })
            }
            else{
                res.status(400).send({message:"email id already exist"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const updateRestaurantWithFood = (req,res)=>{
    try{
        restaurantController.menu.find({restaurantId:req.params.id},(err,data)=>{
            console.log(data)
            restaurantController.restaurant.findOneAndUpdate({_id:req.params.id},{$set:{foodList:data}},{new:true},(err,data1)=>{
                  console.log(data1)
                  res.status(200).send({message:data1})
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const createRestaurant1 = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        restaurantController.restaurant1.countDocuments({restaurantEmail:req.body.restaurantEmail},(err,data)=>{
            if(data==0){
                req.body.restaurantOwnerId = verifyId
                restaurantController.restaurant1.create(req.body,async(err,data1)=>{
                    if(err) throw err
                    console.log(data1)
                    res.status(200).send({message:"Restaurant created Successfully",data1})
                  var data1 = await restaurantController.restaurant1.createIndexes({restaurantLocation:"2dsphere"})
                  console.log(data1)
                })
            }
            else{
                res.status(400).send({message:"email id already exist"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getSpecificRestaurant = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        console.log(verifyId)
        restaurantController.restaurant.findOne({restaurantOwnerId:verifyId},(err,data)=>{
            console.log(data.restaurantOwnerId)
            if(err) throw err

            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getOneRestaurant = (req,res)=>{
    try{
        restaurantController.restaurant.findOne({_id:req.params.id},(err,data)=>{
            console.log(data)
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const updateRestaurant = (req,res)=>{
    try {
        console.log(req.body)
        restaurantController.restaurant.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, (err, data) => {
            if (err) { res.status(400).send({ message: 'invalid id' }) }
            else {
                console.log("line 143",data)
                res.status(200).send({ message: 'updated successfully', data })
            }
        })
    } catch (err) {
        res.status(500).send({message: 'internal server error'})
    }
}

const removeRestaurant = (req,res)=>{
    console.log(req.params.id)
    try {
        restaurantController.restaurant.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
            console.log(data)
            if (err) { res.status(400).send({ message: 'data does not deleted' }) }
            else {
                res.status(200).send({ message: 'data deleted successfully',data})
            }
        })
    }catch (e) {
        res.status(500).send({ message: e.message })
    }
}


const getRestaurantByLocation = (req,res)=>{
    try{
        console.log("data")
        restaurantController.restaurant.find({},(err,data)=>{
           const datas=data.filter(((result)=>filterLocation(result,5000,req.params.latitude,req.params.longitude)))
           res.status(200).send({message:"nearby Restaurant Details",datas})
         
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}



const getRestaurantLocationByRating = (req,res)=>{
    try{
        restaurantController.restaurant.find({},(err,data)=>{
           const datas=data.filter(((result)=>filterLocation(result,500000,req.query.latitude,req.query.longitude)))
           console.log(data)
           console.log(typeof(datas))
            req.body.data = datas
            console.log(req.body.data)
            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                console.log(data1._id)
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                { $unwind: "$data" },
                { $sort: { "data.rating": -1 }},
                { $group: {
                  _id: "$_id",
                  data: { $push: "$data" }
                }},{$project:{"restaurantDetails.foodList.restaurantDetails":0}}],(err,data2)=>{
                    res.status(200).send({message:data2})
                })
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const getRestaurantLocationByRating1 = (req,res)=>{
    try{
        restaurantController.restaurant.find({},(err,data)=>{
           const datas=data.filter(((result)=>filterLocation(result,500000,req.query.latitude,req.query.longitude)))
           console.log("161",datas)
           console.log(typeof(datas))
            req.body.data = datas
            // data.map((x)=>{
            //     console.log("line 165",x)
            // })
            console.log(req.body.data)
            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                console.log(data1._id)
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                    { $unwind: "$data" },
                    { $sort: { "data.rating": -1 }},
                    { $group: {
                      _id: "$_id",
                      data: { $push: "$data" }
                    }}],
                  (err,data2)=>{
                    res.status(200).send({message:data2})
                })
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const getRestaurantLocationByOffer = (req,res)=>{
    try{
           restaurantController.restaurant.find({},(err,data)=>{
           const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
            console.log(typeof(datas))
            req.body.data = datas
            console.log(req.body.data)
            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                console.log(data1)
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                { $unwind: "$data" },
                { $sort: { "data.offer": -1 }},
                { $group: {
                  _id: "$_id",
                  data: { $push: "$data" }
                }}],(err,data2)=>{
                    res.status(200).send({message:data2})
                })
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


function filterLocation(result,radius,latitude,longitude)
    {
      if (!result.restaurantLocation){ 
        return false;
      }
      console.log('line 21',result.restaurantLocation.restaurantLatitude);
      console.log('line 22',result.restaurantLocation.restaurantLongitude);

      var x = geolib.isPointWithinRadius(
        {
          latitude: result.restaurantLocation.restaurantLatitude,
          longitude: result.restaurantLocation.restaurantLongitude
        },
        { 
          latitude,longitude
        }, 
           radius
      );

      console.log('x',x)
      if (x === true) {
        console.log('line 35',result)
        return result;
      }
    
}


// Food

const addFood =async(req,res)=>{
   try{
        // console.log(req.body.restaurantId)
        // restaurantController.restaurant.findById({_id:req.body.restaurantId},(err,data)=>{
        //     console.log(data)
        //     req.body.restaurantDetails = data
            restaurantController.menu.create(req.body, (err, data1) => {
                if (err) { console.log(err) }
                else {
                    console.log(data1)
                    res.status(200).send({ message: data1, statusCode: 200 })
                
                restaurantController.menu.find({restaurantId:data1.restaurantId},(err,data)=>{
                    console.log(data)
                    restaurantController.restaurant.findOneAndUpdate({_id:data1.restaurantId},{$set:{foodList:data}},{new:true},(err,data1)=>{
                          console.log(data1)
                        //   res.status(200).send({message:data1})
                    })
                })
            }
            })
        // }) 
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getFoodByOwner = (req,res)=>{
    try{
        restaurantController.menu.find({ restaurantId: req.params.restaurantId, deleteFlag: 'false' }, (err, data) => {
            console.log(data)
            if (err) {
                res.status(400).send({ message: 'invalid restaurantid' }) }
            else {
                var count=data.length
                console.log(count)
                const datas=paginated.paginated(data,req,res)
                console.log(datas)
                res.status(200).send({ message: datas,count})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const updateFood = (req,res)=>{
    try{
        console.log(req.body)
        restaurantController.menu.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, data) => {
            if (err) { res.status(400).send({ message: 'invalid restarauntid' }) }
            else {
                console.log(data)
                res.status(200).send({ message: data, statusCode: 200 })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const deleteFood = (req, res) => {
    restaurantController.menu.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { new: true }, (err, data) => {
        if (err) { res.status(400).send({ message: 'data is not deleted yet' }) }
        else {
            console.log(data)
            res.status(200).send({ message: 'data deleted successfully' })
        }
    })
}


const filterFoodByPriceLowToHigh = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:1}}],(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
    
}


const filterFoodByPriceHighToLow = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:-1}}],(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

// const getFoodByPrice1 = (req,res)=>{
//     restaurantController.menu.find({ foodPrice : { $gte :  0, $lte : 50}},(err,data)=>{
//         if(err) throw err
//         console.log(data)
//         res.status(200).send({message:data})
//     })
// }

// const getFoodByPrice2 = (req,res)=>{
//     restaurantController.menu.find({ foodPrice : { $gte :  50, $lte : 100}},(err,data)=>{
//         if(err) throw err
//         console.log(data)
//         res.status(200).send({message:data})
//     })
// }

// const getFoodByPrice3 = (req,res)=>{
//     restaurantController.menu.find({ foodPrice : { $gte :  100, $lte : 150}},(err,data)=>{
//         if(err) throw err
//         console.log(data)
//         res.status(200).send({message:data})
//     })
// }

// const getFoodByPrice4 = (req,res)=>{
//     restaurantController.menu.find({ foodPrice : { $gt :  150, $lt : 200}},(err,data)=>{
//         if(err) throw err
//         console.log(data)
//         res.status(200).send({message:data})
//     })
// }

// const filterFood = (req,res)=>{
//     restaurantController.menu.find({ foodPrice : { $gte :  0, $lte : 100},"restaurantDetails.rating":"100"},(err,data)=>{
//         console.log(data)

//     })
// }



const filterFood = (req,res)=>{
    console.log(req.body.category)
    var rating = req.body.rating
    var category = req.body.category
    
    category.map((x)=>{
        rating.map((y)=>{
            restaurantController.menu.aggregate([{ $match: {$or:[{foodPrice: { $gte:0,$lte:50}},{"restaurantDetails.rating":y},{category:x}]}}],(err,data)=>{
                console.log(data)
            })
        })
    })
}


const findlocation = (req,res)=>{
try
{
    var long =parseFloat(req.query.long)
    console.log((typeof(long)))
    var lat =parseFloat(req.query.lat)
    console.log(typeof(lat))
    restaurantController.restaurant1.aggregate([
        {
           $geoNear: {
             near: { type: "Point", coordinates: [long ,lat] },
             key: "restaurantLocation",
             distanceField:"dist.calculated",
             maxDistance: 10000,
             spherical: true
            }
        },
        { $limit: 5 }
     ],(err,data)=>{
         console.log("line 367",data)
     }) 
        }
        catch(err){
            console.log(err)
        } 
    // restaurantController.restaurant.createIndexes((err,data)=>{

    // })
    //     const long = req.query.long
    //     const lat = req.query.lat
    //     restaurantController.restaurant.aggregate([{
    //         $geoNear: {
    //            near: { 
    //              type: "Point",
    //              coordinates: [ 78.0947840335 , 9.93095681364]
    //            },
    //         //    distanceField:"dist.calculated",
    //            maxDistance: 1000000,
    //         //    spherical: true
    //         }
    //       }],(err,data2)=>{
           
    //           console.log(data2)
    //       })
}
// {foodPrice: { $gte:0,$lte:50}}
// ,{"restaurantDetails.rating":{$gte:0,$lte:100}}

//Restaurant Review

const createRestaurantReview = (req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
            console.log(data1)
            if(data1){
                req.body.userId = data1._id
                req.body.userName = data1.name
                restaurantController.restaurantReview.create(req.body,(err,data2)=>{
                    if(err) throw err
                    res.status(200).send({message:data2})
                })
            }
            else{
                res.status(400).send({message:"Invalid token"})
            }
            
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
} 

const getRestaurantReview = (req,res)=>{
    try{
        restaurantController.restaurantReview.find({restaurantId:req.params.id},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

// Rating

const restaurantRating = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
        console.log(data1)
        if(data1){
            req.body.userId = data1._id
            restaurantController.restaurantRating.create(req.body,(err,data2)=>{
                if(err) throw err
                res.status(200).send({message:data2})
            })
        }
    })
}



const searchAPI = (req,res)=>{
    try{
        restaurantController.restaurant.find({},(err,data)=>{
            const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
            req.body.data = datas
            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                console.log("line 547",data1)
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},{ $unwind:"$data"},{$match:{$or:[{"data.restaurantName":req.params.key},{"data.foodList.foodName":req.params.key}]}},{ $group: {
                    _id: "$_id",
                    data: { $push: "$data" }
                    }}],(err,data)=>{
                    if(err) throw err
                    console.log(data)
                    res.status(200).send({message:data})
                }) 
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}
// ,{$match:{$or:[{"data.restaurantName":req.params.key},{"data.foodList.foodName":req.params.key}]}}

// ,{$match: {$or:[{"data.restaurantName":req.params.key},{"data.foodList.foodName":req.params.key}]}}

// {$or:[{"restaurantName":req.params.key},{"restaurantName":req.params.key}]}


module.exports={
    image,
    createRestaurant,
    updateRestaurantWithFood,
    createRestaurant1,
    getSpecificRestaurant,
    getOneRestaurant,
    updateRestaurant,
    removeRestaurant,
    getRestaurantByLocation,
    getRestaurantLocationByOffer,
    getRestaurantLocationByRating,
    getRestaurantLocationByRating1,
    findlocation,
    addFood,
    getFoodByOwner,
    updateFood,
    deleteFood,
    filterFoodByPriceLowToHigh,
    filterFoodByPriceHighToLow,
    // getFoodByPrice1,
    // getFoodByPrice2,
    // getFoodByPrice3,
    // getFoodByPrice4,
    filterFood,
    createRestaurantReview,
    getRestaurantReview,
    restaurantRating,
    searchAPI
}