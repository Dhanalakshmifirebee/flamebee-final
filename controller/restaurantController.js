const restaurantController = require('../model/restaurantSchema')
const responseController = require('../model/responseSchema')
const adminController = require('../model/adminSchema')
const {location} = require("../model/RestaurantLocation")
const jwt = require('jsonwebtoken')
const geolib = require('geolib')
const { Z_BEST_COMPRESSION } = require('zlib')
const paginated=require('./adminController')
const nodeGeocoder = require('node-geocoder');
const moment = require('moment')
const mongoose = require('mongoose')

const { type } = require('express/lib/response')


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


const getLatLongByLocation = async(req,res)=>{
    try{
        let options = { provider: 'openstreetmap'}
        let geoCoder = nodeGeocoder(options);
        const convertAddressToLatLon=await(geoCoder.geocode(req.body.location))
        req.body.locationLatLong = {"latitude":convertAddressToLatLon[0].latitude,"longitude":convertAddressToLatLon[0].longitude}
        location.create(req.body,(err,data)=>{
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const createRestaurant = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        console.log(verifyId)
        adminController.adminSchema.aggregate([{$match:{$and:[{_id:new mongoose.Types.ObjectId(verifyId)},{status:"active"}]}}],async(err,data)=>{
            console.log(data.length);
            if(data.length!=0){
                console.log("data");
                let options = { provider: 'openstreetmap'}
                let geoCoder = nodeGeocoder(options);
                const convertAddressToLatLon=await(geoCoder.geocode(req.body.restaurantAddress))
            
                if(data[0].subscriptionPlan == "Free"){
                    console.log("line 58")
                    if(data[0].subscriptionEndDate>moment(new Date()).toISOString()){
                        const createRestaurant = await restaurantController.restaurant.aggregate([{$match:{restaurantOwnerId:verifyId}}])
                        console.log("line 61",createRestaurant.length)
                            if(createRestaurant.length<1){
                                req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
                                req.body.restaurantOwnerId = verifyId
                                restaurantController.restaurant.create(req.body,(err,data2)=>{
                                    res.status(200).send({message:"Restaurant created Successfully",data2})
                                })
                            }
                            else{
                                res.status(400).send({message:"restaurant owner will add only one restaurant in free package plan"})
                            }
                    }
                    else{
                        adminController.adminSchema.findOneAndUpdate({_id:verifyId},{$set:{status:"inActive"}},{new:true},(err,data3)=>{
                            console.log(data3)
                            res.status(400).send({message:'Your Free packagePlan is expired,please subscribe package plan'})
                        })
                    }
                }
                
                if(data[0].subscriptionPlan == "3 months" || data[0].subscriptionPlan == "6 months" || data[0].subscriptionPlan == "12 months"){
                    console.log("inside if");
                    console.log(data[0].subscriptionEndDate);
                    console.log(moment().format());
                    if(data[0].subscriptionEndDate>moment(new Date()).toISOString()){
                        console.log("inside if");
                        const createRestaurant = await restaurantController.restaurant.aggregate([{$match:{$and:[{restaurantOwnerId:verifyId},{restaurantEmail:req.body.restaurantEmail}]}}])
                        console.log("line 87",createRestaurant.length)
                            if(createRestaurant.length==0){
                                req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
                                req.body.restaurantOwnerId = verifyId
                                restaurantController.restaurant.create(req.body,(err,data2)=>{
                                    res.status(200).send({message:"Restaurant created Successfully",data2})
                                })
                            }
                            else{
                                res.status(400).send({message:"Restaurant already exists"})
                            }
                    }
                    else{
                        adminController.adminSchema.findOneAndUpdate({_id:verifyId},{$set:{status:"inActive"}},{new:true},(err,data3)=>{
                            console.log(data3)
                            res.status(400).send({message:'Your packagePlan is expired,please subscribe package plan'})
                        })
                    }
                }
            }
            else{
                res.status(400).send({message:"please subscribe package plan"})
            }
        })



        // adminController.packagePlanSchema.findOne({adminId:verifyId},(err,data1)=>{
        //     console.log(data1);
        //     if(data1.status=="active"){
        //         console.log(data1)
        //             if(data1.packageDetails.packagePlan=="Free"){
        //                 console.log(data1.expiredDate);
        //                 console.log(new Date().toLocaleString());
        //                 if(data1.expiredDate>new Date().toLocaleString()){
        //                     restaurantController.restaurant.countDocuments({restaurantOwnerId:verifyId},async(err,num)=>{
        //                         console.log(num)
        //                             if(num<=3){
        //                                 req.body.restaurantOwnerId = verifyId
        //                                 let options = { provider: 'openstreetmap'}
        //                                 let geoCoder = nodeGeocoder(options);
        //                                 const convertAddressToLatLon=await(geoCoder.geocode(req.body.restaurantAddress))
        //                                 console.log(convertAddressToLatLon);
        //                                 req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
        //                                 restaurantController.restaurant.create(req.body,(err,data2)=>{
        //                                 res.status(200).send({message:"Restaurant created Successfully",data2})
        //                                 })
        //                             }
        //                             else{
        //                                 adminController.packagePlanSchema.findOneAndUpdate({adminId:verifyId},{$set:{status:"inActive"}},{new:true},(err,data3)=>{
        //                                     console.log(data3)
        //                                     res.status(400).send({message:'Your Free packagePlan is expired,please subscribe package plan'})
        //                                 })
        //                             }
        //                     }) 
        //                 }
        //             }
                
    
        //         if(data1.packageDetails.packagePlan=="6 months"){
        //             if(data1.expiredDate>new Date().toLocaleString()){
        //                     restaurantController.restaurant.countDocuments({restaurantEmail:req.body.restaurantEmail},async(err,num)=>{
        //                         console.log(num)
        //                             if(num==0){
        //                                 req.body.restaurantOwnerId = verifyId
        //                                 let options = { provider: 'openstreetmap'}
        //                                 let geoCoder = nodeGeocoder(options);
        //                                 const convertAddressToLatLon=await(geoCoder.geocode(req.body.restaurantAddress))
        //                                 console.log(convertAddressToLatLon);
        //                                 req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
        //                                 restaurantController.restaurant.create(req.body,(err,data4)=>{
        //                                 res.status(200).send({message:"Restaurant created Successfully",data4})
        //                                 })
        //                             }
        //                             else{
        //                                 res.status(400).send({message:"Restaurant already exists"})
        //                             }
        //                     })
        //             }else{
        //                 adminController.packagePlanSchema.findOneAndUpdate({adminId:verifyId},{$set:{status:"inActive"}},{new:true},(err,data3)=>{
        //                     console.log(data3)
        //                     res.status.send({message:'Your 6months packagePlan is expired,please subscribe package plan'})
        //                 })
        //             }
        //         }

        //         if(data1.packageDetails.packagePlan=="12 months"){
        //             if(data1.expiredDate>new Date().toLocaleString()){
        //                     restaurantController.restaurant.countDocuments({restaurantEmail:req.body.restaurantEmail},async(err,num)=>{
        //                         console.log(num)
        //                             if(num==0){
        //                                 req.body.restaurantOwnerId = verifyId
        //                                 let options = { provider: 'openstreetmap'}
        //                                 let geoCoder = nodeGeocoder(options);
        //                                 const convertAddressToLatLon=await(geoCoder.geocode(req.body.restaurantAddress))
        //                                 console.log(convertAddressToLatLon);
        //                                 req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
        //                                 restaurantController.restaurant.create(req.body,(err,data4)=>{
        //                                 res.status(200).send({message:"Restaurant created Successfully",data4})
        //                                 })
        //                             }
        //                             else{
        //                                 res.status(400).send({message:"Restaurant already exists"})
        //                             }
        //                     })
        //             }else{
        //                 adminController.packagePlanSchema.findOneAndUpdate({adminId:verifyId},{$set:{status:"inActive"}},{new:true},(err,data3)=>{
        //                     console.log(data3)
        //                     res.status.send({message:'Your 12months packagePlan is expired,please subscribe package plan'})
        //                 })
        //             }
        //         }
        //     }
        //     else{
        //         res.status(400).send({message:"please subscribe package plan"})
        //     }
            
        // })
        // adminController.packagePlanSchema.aggregate([{$match:{$and:[{restaurantOwnerId:verifyId},{"packageDetails.package":"Free"}]}}],(err,data)=>{
        //     if(data){
        //         restaurantController.restaurant.countDocuments({restaurantOwnerId:verifyId},(err,num)=>{
        //                 console.log(num)
        //                 if(num<=3){
        //                     req.body.restaurantOwnerId = verifyId
        //                     restaurantController.restaurant.create(req.body,(err,data)=>{
        //                         res.status(200).send({message:"Restaurant created Successfully",data})
        //                     })
        //                 }
        //                 else{
        //                     res.status(400).send({message:"error"})
        //                 }
        //         })
        //     }
        // })


        
        // restaurantController.restaurant.countDocuments({restaurantOwnerId:verifyId},(err,num)=>{
        //     console.log(num)
        //     if(num<=3){
                
        //         req.body.restaurantOwnerId = verifyId
        //         restaurantController.restaurant.create(req.body,(err,data)=>{
        //             res.status(200).send({message:"Restaurant created Successfully",data})
        //         })
        //     }
        //     else{
        //         res.status(400).send({message:"error"})
        //     }
        // })
        // restaurantController.restaurant.countDocuments({restaurantEmail:req.body.restaurantEmail},(err,data)=>{
        //     if(data==0){
        //         restaurantController.restaurant.countDocuments({restaurantOwnerId:verifyId})
        //         req.body.restaurantOwnerId = verifyId
        //         restaurantController.restaurant.create(req.body,(err,data1)=>{
        //             if(err) throw err
        //             res.status(200).send({message:"Restaurant created Successfully",data1})
        //         })
        //     }
        //     else{
        //         res.status(400).send({message:"email id already exist"})
        //     }
        // })
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
        adminController.packagePlanSchema.findOne({adminId:verifyId,status:"active"},(err,data)=>{
            if(data){
                restaurantController.restaurant.find({restaurantOwnerId:verifyId},(err,data)=>{
                    if(err) throw err
                    var count=data.length
                    console.log(count)
                    const datas=paginated.paginated(data,req,res)
                    res.status(200).send({message:datas,count})
                })
            }
            else{
                res.status(400).send({message:"plan is expired"})
            }
           
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
           var count=datas.length
           console.log(count)
           const data1=paginated.paginated(datas,req,res)
           res.status(200).send({message:data1,count})
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
                    var count=data2.length
                    console.log(count)
                    var arr = []
                    data2.map((x)=>{
                        x.data.map((y)=>{
                           arr.push(y)
                        }) 
                    })
                    console.log(arr.length)
                    function paginate1(array, page_size, page_number) {
                        return array.slice((page_number - 1) * page_size, page_number * page_size);
                    }
                    const result =  paginate1(arr,req.query.limit,req.query.page)
                    res.status(200).send({message:result})
                    // const data1=paginated.paginated(data2,req,res)
                    // res.status(200).send({message:data2,count})
                    
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
            // console.log(req.body.data)
            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                // console.log(data1)
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                { $unwind: "$data" },
                { $sort: { "data.offer": -1 }},
                { $group: {
                  _id: "$_id",
                  data: { $push: "$data" }
                }},{$project:{"restaurantDetails.foodList.restaurantDetails":0}}],(err,data2)=>{
                    var count=data2.length
                    console.log(count)
                    var arr = []
                    data2.map((x)=>{
                        x.data.map((y)=>{
                            // console.log(y)
                            arr.push(y)
                        })
                    })
                    // console.log(arr)
                    console.log(arr.length)
                    function paginate1(array, page_size, page_number) {
                        return array.slice((page_number - 1) * page_size, page_number * page_size);
                    }
                    const result =  paginate1(arr,req.query.limit,req.query.page)
                    res.status(200).send({message:result})
                    // const data1=paginated.paginated(arr,req,res)
                    // console.log(data1)
                    // res.status(200).send({message:data1,count})
                })
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}



const filterFood = (req,res)=>{
    try{
        console.log(req.body)
        console.log(req.query);
    
    //     console.log(Object.keys(req.body).length);
    //     var key = [];
    //     key.push(...Object.keys(req.body))
    //     console.log(key);
    //     var l = [];
    //     var value = [];
    //     l.push(...Object.values(req.body))
    //     console.log(l);             
    // for(var i = 0 ; i < l.length; i ++){
    //    value.push(...l[i])
    // }
    // console.log(value);
        var a = req.body.cuisine
        console.log("line 279",a);
        var b = req.body.rating
        console.log("line 425",b);
        var c = req.body.price
        console.log("line 427",c);
        var d = req.body.distance
        
        restaurantController.restaurant.find({},{"foodList.restaurantDetails":0},(err,data)=>{
            if(data){
                const datas=data.filter(((result)=>filterLocation(result,d,req.body.latitude,req.body.longitude)))
           
                const result = []
                var result1 = []
                console.log(a)
                if(a!==null && a!==undefined){
                   for(var i=0;i<a.length;i++){
                       for(var j=0;j<datas.length;j++){
                            for(var k=0;k<datas[j].cuisine.length;k++){
                               if(a[i]===datas[j].cuisine[k]){
                                   console.log("dfg")
                                   result1.push(datas[j])
                               }
                            }
                        }
                    }
                    result.push(...result1)
                }
        
                var result2 =[]
                if(b!==null && b!==undefined){
                    for(var i=0;i<b.length;i++){
                        for(var j=0;j<datas.length;j++){
                             if(b[i]== datas[j].rating){
                                result2.push(datas[j])
                             }
                         }
                     }
                    result.push(...result2)
                }
               
            
                var result3 =[]
                if(c!==null ||c!==undefined){
                   for(var i=0;i<datas.length;i++){
                       for(var j=0;j<datas[i].foodList.length;j++){
                           if(c<datas[i].foodList[j].foodPrice){
                               result3.push(datas[i])
                           }
                       }
                   }
                   result.push(...result3)
                }
               console.log("line 342",result3)
               const  uniqueElements = [...new Set(result)]
               console.log("348",uniqueElements);
               res.status(200).send(uniqueElements);
        
            }
            else{
                res.status(400).send({message:err})
            }
           
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
   
}
        // for(var i = 0; i< key.length;i ++){           //key
        //     for (var j  = 0 ; j< value.length; j ++){     // value
        //         for(var r = 0 ; r < datas.length ; r ++){      //data
        //            for(var s=0 ; s< cuisine.length ;s++){
        //               if(data[r].cuisine[s]== value[j]){
        //                 //  console.log(data[r])
        //                  result.push(data[r])
        //               }
        //               for(var t=0;t< rating.length;t++){
        //                   if(data[r].rating==rating[t]){
        //                       console.log(data[r])
        //                       result.push(data[r])
        //                   }
        //                 // for(var u=0;u<foodPrice.length;u++){
        //                 //     if(data[r].f)
        //                 // }
        //               }

        //             //    for(var t=0;t< rating.length ; t++){
        //             //        for(var v =0;v<foodPrice.length; v++){

        //             //        }
        //             //    }
        //            }
                    
        //         }
        //     }
        // }
    //    console.log(result)
    //    res.send(result1)
    //     var arr = []
    //     // console.log("line 274",datas)
    //     // res.send(datas)
    //     for(var i=0;i<datas.length;i++){
    //         for(var j = 0 ; j<Object.values(y).length;j ++){


    //         }
    //         // var index = datas.filter((b)=>b.rating==y[i])
    //         // console.log(index)
    //         // arr.push(index)
    //         // if(x!==null){
    //         //     for(var j=0;j<=arr.length;j++){
    //         //         var index2 = arr.map((c)=>{c.filter((e)=>e.category==x[i])})
    //         //         console.log(index2)

    //         //     }
    //         // }
    //     }

    //     // res.send(arr)
    // })



    //  restaurantController.restaurant.aggregate([{$match:{rating:{"$in":[z,y]}}}],(err,data)=>{
    //      console.log(data)
    //  })




    // restaurantController.restaurant.find({},{"foodList.restaurantDetails":0},(err,data)=>{
    //     console.log(data)
       
        // category.map((x)=>{
        //     rating.map((y)=>{
        //         console.log(y)
        //        foodPrice.map((z)=>{
              
                // restaurantController.restaurant.aggregate([{ $match:{$or:[{rating:y},{"foodList.category":x},{"foodList.foodPrice": z}]}},{$project:{"foodList.restaurantDetails":0}}],(err,data1)=>{
                //     // console.log(data1)
                   
                //     const datas=data1.filter(((result)=>filterLocation(result,distance,req.query.latitude,req.query.longitude)))
                //     console.log("line 274",datas)
                //     // res.send(datas)

                // })
                
    //            })
    //         })
   
    // })

    // {$or:[{rating:y},{"foodList.cuisine":x},{"foodList.foodPrice": z}]}

        // {"foodList.foodPrice": z},
        // console.log(data)
        // data.map((x)=>{
        //    x.foodList.map((y)=>{
        //         console.log(y)

        //     })
        // })
        // foodList.map((x)=>{
        //     console.log("262",x)
        // })
        // category.map((x)=>{
        // rating.map((y)=>{
        //     restaurantController.restaurant.aggregate([{ $match: {$or:[{foodListfoodPrice: { $gte:0,$lte:50}},{"restaurantDetails.rating":y},{category:x}]}}],(err,data)=>{
        //         console.log(data)
        //         const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
        //         console.log("line 262",datas)
        //     })
        // })
    // })
       


        
    // category.map((x)=>{
    //     rating.map((y)=>{
    //         restaurantController.menu.aggregate([{ $match: {$or:[{foodPrice: { $gte:0,$lte:50}},{"restaurantDetails.rating":y},{category:x}]}}],(err,data)=>{
    //             console.log(data)
    //         })
    //     })
    // })


function filterLocation(result,radius,latitude,longitude)
    {
      if (!result.restaurantLocation){ 
        return false;
      }
    //   console.log('line 21',result.restaurantLocation.restaurantLatitude);
    //   console.log('line 22',result.restaurantLocation.restaurantLongitude);

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

    //   console.log('x',x)
      if (x === true) {
        // console.log('line 35',result)
        return result;
      }
    
}


// Food

const addFood =async(req,res)=>{
   try{
        console.log(req.body.restaurantId)
        restaurantController.restaurant.findById({_id:req.body.restaurantId},{foodList:0},(err,data)=>{
            console.log(data)
            req.body.restaurantDetails = data
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
        }) 
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
        restaurantController.menu.findByIdAndUpdate(req.params.foodId, req.body, { new: true }, (err, data) => {
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
    restaurantController.menu.findByIdAndUpdate(req.params.foodId, { deleteFlag: "true" }, { new: true }, (err, data) => {
        if (err) { res.status(400).send({ message: 'data is not deleted yet' }) }
        else {
            console.log(data)
            res.status(200).send({ message: 'data deleted successfully' })
        }
    })
}


const filterFoodByPriceLowToHigh = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:1}},{$project:{"restaurantDetails.foodList":0}}],(err,data)=>{
            const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
            if(err) throw err
            console.log(datas.length)
            // console.log(data.length)
            var count=datas.length
            console.log(count)
            const data1=paginated.paginated(datas,req,res)
            res.status(200).send({message:data1,count})
            
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
    
}


const filterFoodByPriceHighToLow = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:-1}},{$project:{"restaurantDetails.foodList":0}}],(err,data)=>{
            const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
            if(err) throw err
            console.log(datas.length)
            var count=datas.length
            console.log(count)
            const data1=paginated.paginated(datas,req,res)
            res.status(200).send({message:data1,count})
           
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const getCategoryList = (req,res)=>{
    restaurantController.menu.find({},(err,data)=>{
        const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
        // console.log(datas)
        var arr = []
        datas.map((x)=>{
            console.log(x.cuisine)
            arr.push(x.cuisine)
        })
        console.log(arr)
        var arr1 = []
        var counts ={}

        arr.forEach(function (x){ 
            counts[x] = (counts[x] || 0) + 1; 
            });
            console.log(counts)
        var removeDuplicates = [...new Set(arr)]; 
        removeDuplicates.map((x)=>{
            console.log(x);
            const object = {category:x}
            arr1.push(object)
        })
         console.log(arr1);
        // console.log(removeDuplicates)
       
        arr.forEach(function (x){ 
            counts[x] = (counts[x] || 0) + 1; 
            });
        console.log(counts)

        res.status(200).send({message:removeDuplicates})
    })
}

function compressArray(original) {
 
	var compressed = [];
	// make a copy of the input array
	var copy = original.slice(0);
 
	// first loop goes over every element
	for (var i = 0; i < original.length; i++) {
 
		var myCount = 0;	
		// loop over every element in the copy and see if it's the same
		for (var w = 0; w < copy.length; w++) {
			if (original[i] == copy[w]) {
				// increase amount of times duplicate is found
				myCount++;
				// sets item to undefined
				delete copy[w];
			}
		}
 
		if (myCount > 0) {
			var a = new Object();
			a.value = original[i];
			a.count = myCount;
			compressed.push(a);
		}
	}
 
	return compressed;
};



function filterLocationForFood(result,radius,latitude,longitude)
    {
      if (!result.restaurantDetails.restaurantLocation){ 
        return false;
      }
      console.log('line 21',result.restaurantDetails.restaurantLocation.restaurantLatitude);
      console.log('line 22',result.restaurantDetails.restaurantLocation.restaurantLongitude);

      var x = geolib.isPointWithinRadius(
        {
          latitude: result.restaurantDetails.restaurantLocation.restaurantLatitude,
          longitude: result.restaurantDetails.restaurantLocation.restaurantLongitude
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
            var count=data1.length
            console.log(count)
            const data1=paginated.paginated(data,req,res)
            res.status(200).send({message:data1,count})
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
                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},{ $unwind:"$data"},{$match:{$or:[{"data.restaurantName":req.params.key},{"data.foodList.foodName":req.params.key}]}},{$project:{"data.foodList.restaurantDetails":0}},{ $group: {
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
    getLatLongByLocation,
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
    getCategoryList,
    // getFoodByPrice1,
    // getFoodByPrice2,
    // getFoodByPrice3,
    // getFoodByPrice4,
    filterFood,
    createRestaurantReview,
    getRestaurantReview,
    restaurantRating,
    searchAPI,
    
}