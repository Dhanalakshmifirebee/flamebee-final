const restaurantController = require('../model/restaurantSchema')
const responseController = require('../model/responseSchema')
const adminController = require('../model/adminSchema')
// const adminRequestController = require('../model/adminSchema')
const {location} = require("../model/RestaurantLocation")
const jwt = require('jsonwebtoken')
const geolib = require('geolib')
const { Z_BEST_COMPRESSION } = require('zlib')
const paginated=require('./userController')
const nodeGeocoder = require('node-geocoder');
const moment = require('moment')
const mongoose = require('mongoose')
const { type } = require('express/lib/response')


const image = (req,res)=>{
    try{
        console.log("1")
        console.log(req.file);
        req.body.image = `http://192.168.0.112:8613/uploads/${req.file.filename}`
        console.log(req.body)
        
        restaurantController.image.create(req.body,(err,data)=>{
            if(err) {
                throw err
            }
            else{
                console.log(data)
                res.status(200).send({message:data}) 
            }
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
    console.log("1");
    try{
       console.log("2");
       const token = req.headers.authorization
        if(token!=null){
            const adminToken = jwt.decode(token)
            const verifyId = adminToken.userid
            console.log(verifyId)
            adminController.adminRequest.aggregate([{$match:{$and:[{_id:new mongoose.Types.ObjectId(verifyId)},{status:'true'}]}}],async(err,data)=>{
                console.log(data);
                console.log(data.length);
                if(data.length!=0){
                    console.log("data");
                    let options = { provider: 'openstreetmap'}
                    let geoCoder = nodeGeocoder(options);
                    const convertAddressToLatLon=await(geoCoder.geocode(req.body.address))
                     // if(data[0].subscriptionPlan == "Free"){
                        // console.log("line 58")
                        // // if(data[0].subscriptionEndDate>moment(new Date()).toISOString()){
                        //     const createRestaurant = await restaurantController.restaurant.aggregate([{$match:{restaurantOwnerId:verifyId}}])
                        //         console.log("line 61",createRestaurant.length)
                        //         if(createRestaurant.length<1){
                                    req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
                                    req.body.restaurantOwnerId = verifyId
                                    console.log("line 81",req.body)
                                    const result1 = req.body.restaurantName.toLowerCase()
                                    req.body.restaurantName = result1
                                   
                                    console.log(req.body.restaurantName);
                                
                                    restaurantController.restaurant.create(req.body,(err,data2)=>{
                                        if(err){
                                            throw err
                                        }
                                        else{
                                            console.log("line 82",data2);
                                            res.status(200).send({message:"Restaurant created Successfully",data2})
                                        }
                                        
                                    })
                                }
                                // else{
                                //     res.status(400).send({message:"restaurant owner will add only one restaurant in free package plan"})
                                // }
                        // }
                        // else{
                        //     adminController.adminRequest.findOneAndUpdate({_id:verifyId},{$set:{planStatus:"inActive"}},{new:true},(err,data3)=>{
                        //         console.log(data3)
                        //         res.status(400).send({message:'Your Free packagePlan is expired,please subscribe package plan'})
                        //     })
                        // }
                    // }
                    
                //     if(data[0].subscriptionPlan == "3 months" || data[0].subscriptionPlan == "6 months" || data[0].subscriptionPlan == "12 months"){
                //         console.log("inside if");
                //         console.log(data[0].subscriptionEndDate);
                //         console.log(moment().format());
                //         if(data[0].subscriptionEndDate>moment(new Date()).toISOString()){
                //             console.log("inside if");
                //             // const createRestaurant = await restaurantController.restaurant.aggregate([{$match:{$and:[{restaurantOwnerId:verifyId},{restaurantEmail:req.body.restaurantEmail}]}}])
                //             console.log("line 87",createRestaurant.length)
                //                 if(createRestaurant.length==0){
                //                     // req.body.restaurantLocation = {"restaurantLatitude":convertAddressToLatLon[0].latitude,"restaurantLongitude":convertAddressToLatLon[0].longitude}
                //                     req.body.restaurantOwnerId = verifyId
                //                     restaurantController.restaurant.create(req.body,(err,data2)=>{
                //                         res.status(200).send({message:"Restaurant created Successfully",data2})
                //                     })
                //                 }
                //                 else{
                //                     res.status(400).send({message:"Restaurant already exists"})
                //                 }
                //         }
                //         else{
                //             adminController.adminRequest.findOneAndUpdate({_id:verifyId},{$set:{PlanStatus:"inActive"}},{new:true},(err,data3)=>{
                //                 console.log(data3)
                //                 res.status(400).send({message:'Your packagePlan is expired,please subscribe package plan'})
                //             })
                //         }
                //     }
                // }
                else{
                    // res.status(400).send({message:"please subscribe package plan"})
                    res.status(400).send({message:"Invalid token"})
                }
            })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
    }
    
    catch(err){
        res.status(500).send({message:err.message})
    }
}

// ,{planStatus:"active"}

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


const getSpecificRestaurant = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const adminToken = jwt.decode(req.headers.authorization) 
            const verifyId = adminToken.userid
            console.log(verifyId)
                restaurantController.restaurant.aggregate([{$match:{$and:[{restaurantOwnerId:verifyId},{deleteFlag:"false"}]}},{$project:{"foodList.restaurantDetails":0}}],(err,data)=>{
                        if(err) {
                            throw err
                        }
                        if(data.length!=0){
                            var count=data.length
                            console.log(count)
                            res.status(200).send({message:data,count})
                        }
                        else{
                            res.status(400).send({message:"data not found"})
                        }
                        
                })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getOneRestaurantById = (req,res)=>{
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

const getAllRestaurant = (req,res)=>{
    try{
        restaurantController.restaurant.aggregate([{$match:{deleteFlag:"false"}},{$project:{"foodList.restaurantDetails":0}}],(err,data)=>{
            console.log(data)
            if(err){
                throw err
            }
            else{
                if(data.length!=0){
                    res.status(200).send({message:data})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
          
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const updateRestaurant = (req,res)=>{
    try {
        console.log(req.body)
        restaurantController.restaurant.findOneAndUpdate({_id:req.params.id},req.body,{ new: true },(err, data) => {
            if (err) { 
                res.status(400).send({ message: 'invalid id' }) 
            }
            else {
                console.log("line 143",data)
                res.status(200).send({ message: 'updated successfully', data })
            }
        })
    } catch (err) {
        res.status(500).send({message:err.message})
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
        restaurantController.restaurant.find({deleteFlag:"false"},(err,data)=>{
            if(err){
                throw err
            }
            else{
                console.log(data);
                const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
                if(datas.length!=0){
                     var count=datas.length
                     console.log(count)
                     console.log(datas);
                 //    const data1=paginated.paginated(datas,req,res)
                     res.status(200).send({message:datas,count})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getRestaurantLocationByRating = (req,res)=>{
    try{
        console.log("1");
        if(req.query.latitude && req.query.longitude){
          restaurantController.restaurant.find({deleteFlag:"false"},(err,data)=>{
              if(err){
                  throw err
              }
              else{
                    const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
                    if(data.length!=0){
                        console.log(datas)
                        console.log(typeof(datas))
                            req.body.data = datas
                            console.log(req.body.data)
                            responseController.responseRestaurant.create(req.body,(err,data1)=>{
                                console.log(data1._id)
                                responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                                { $unwind: "$data" },
                                { $sort: { "data.ratingValue": -1 }},
                                { $group: {
                                _id: "$_id",
                                data: { $push: "$data" }
                                }},{$project:{"restaurantDetails.foodList.restaurantDetails":0}}],(err,data2)=>{
                                    var count=data2.length
                                    console.log(count)
                                    // var arr = []
                                    // data2.map((x)=>{
                                    //     x.data.map((y)=>{
                                    //        arr.push(y)
                                    //     }) 
                                    // })
                                    res.status(200).send({message:data2})
                                })
                            })
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
               }
            })
        }
        else{
            res.status(400).send({message:"please send lattitude, longitude as query format"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getRestaurantLocationByRating1 = (req,res)=>{
    try{
        restaurantController.restaurant.find({},(err,data)=>{
           const datas=data.filter(((result)=>filterLocation(result,500000,req.query.latitude,req.query.longitude)))
           console.log("161",datas)
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
        if(req.query.latitude && req.query.longitude){
           restaurantController.restaurant.find({deleteFlag:"false"},(err,data)=>{
               if(err){
                   throw err
               }
               else{
                    const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
                    console.log(datas)
                    if(datas.length!=0){
                        console.log(typeof(datas))
                        req.body.data = datas
                        responseController.responseRestaurant.create(req.body,(err,data1)=>{
                            console.log(data1)
                            responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},
                            { $unwind: "$data" },
                            { $sort: { "data.offer": -1 }},
                            { $group: {
                            _id: "$_id",
                            data: { $push: "$data" }
                            }},{$project:{"restaurantDetails.foodList.restaurantDetails":0}}],(err,data2)=>{
                                if(err){
                                    throw err
                                }
                                else{
                                    if(data.length!=0){
                                        var count=data2.length
                                        console.log(count)
                                        var arr = []
                                        data2.map((x)=>{
                                            x.data.map((y)=>{
                                                arr.push(y)
                                            })
                                        })
                                        res.status(200).send({message:data2,count})
                                    }
                                    else{
                                        res.status(400).send({message:"data not found"})
                                    }
                                }
                            })
                        })
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
                }
             })
       }
       else{
           res.status(400).send({message:"please send lattitude, longitude as query format"})
       }
    }

    catch(err){
        res.status(500).send({message:err.message})
    }
}



const filterFood = (req,res)=>{
    try{
        if(req.body.latitude && req.body.longitude){
        console.log(req.body)
        console.log(req.query);
        var a = req.body.cuisine
        console.log("line 279",a);
        var b = req.body.rating
        console.log("line 425",b);
        var c = req.body.price
        console.log("line 427",c);
        var d = req.body.distance
        
        restaurantController.restaurant.find({deleteFlag:"false"},{"foodList.restaurantDetails":0},(err,data)=>{
            if(err){
                throw err
            }
            else{
                if(data.length!=0){
                    const datas=data.filter(((result)=>filterLocation(result,d,req.body.latitude,req.body.longitude)))
                    if(datas.length!=0){
                        const result = []
                        var result1 = []
                        if(a!==null && a!==undefined){
                           for(var i=0;i<a.length;i++){
                               for(var j=0;j<datas.length;j++){
                                    for(var k=0;k<datas[j].cuisine.length;k++){
                                       if(a[i]===datas[j].cuisine[k]){
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
                        res.status(400).send({message:"data not found"})
                    }
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
        })
      }
      else{
        res.status(400).send({message:"please send latitude,longitude as query format"})
      }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}



function filterLocation(result,radius,latitude,longitude)
    {
        console.log(result.category);
        console.log(typeof(result));
      if (!result.restaurantLocation){ 
          console.log("--------");
        return false;
      }
      console.log("----gjgd----");
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
          console.log("x",result)
        return result;
      }
    
}


// Food

const addFood =async(req,res)=>{
   try{
       console.log("11");
        console.log(req.params.restaurantId)
        restaurantController.restaurant.findOne({_id:req.params.restaurantId},{foodList:0},(err,data)=>{
            if(err){
                  throw err
            }
            else{
                // console.log(data)
                req.body.restaurantDetails = data
                const result1 = req.body.foodName.toLowerCase()
                req.body.foodName = result1
                restaurantController.menu.create(req.body, (err, data1) => {
                    if (err) { 
                        throw err 
                    }
                    else {
                        // console.log(data1)
                        res.status(200).send({ message: data1, statusCode: 200 })
                        restaurantController.menu.aggregate([{$match:{"restaurantDetails._id":mongoose.Types.ObjectId(req.params.restaurantId)}}],(err,data)=>{
                            if(err){
                                throw err
                            }
                            else{
                                if(data.length!=0){
                                    console.log(data)
                                    restaurantController.restaurant.findOneAndUpdate({_id:req.params.restaurantId},{$set:{foodList:data}},{new:true},(err,data1)=>{
                                        if(err){
                                            throw err
                                        }
                                        else{
                                            console.log(data1)
                                        }
                                    })
                                }
                                else{
                                    res.status(400).send({message:"data not found"})
                                }
                            }
                            
                        })
                    }
                })
            }
           
        }) 
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getAllFood = (req,res)=>{
    try{
        restaurantController.menu.find({deleteFlag:"false"},(err,data)=>{
            console.log(data)
            if(err){
                throw err
            }
            else{
                if(data.length!=0){
                    res.status(200).send({message:data})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
          
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getFoodByOwner = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            console.log(verify);
            restaurantController.menu.aggregate([{$match:{$and:[{"restaurantDetails.restaurantOwnerId":verify},{deleteFlag:"false"}]}}],(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    if(data.length!=0){
                        res.status(200).send({message:data})
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
                }
                
            })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
       
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const updateMenu= (req,res)=>{
    try{
        restaurantController.menu.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const deleteMenu= (req,res)=>{
    try{
        restaurantController.menu.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const updateFood = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
             const decoded = jwt.decode(token)
             const verify = decoded.userid
             restaurantController.restaurant.findOne({_id:req.params.restaurantId},(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    var result = data.foodList.map((x)=>{
                         if(x._id.toString()===req.params.foodId.toString()){
                             console.log("1");
                             x.foodName = req.body.foodName
                             x.foodImage = req.body.foodImage
                             x.foodPrice = req.body.foodPrice
                             x.category = req.body.category
                             x.cuisine = req.body.cuisine
                        }              
                        return x
                     })
                    console.log(result)
                    restaurantController.restaurant.findOneAndUpdate({_id:req.params.restaurantId},{$set:{foodList:result}},{new:true},(err,data)=>{
                        if(err){
                            throw err
                        }
                        else{
                            res.status(200).send({message:data})
                        }
                    })
                }
            })
        }
        else{ 
           res.status(400).send({message:"unAuthorized"})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
}



const deleteFood = (req, res) => {
    try{ 
        const token = req.headers.authorization
        if(token != null){
             restaurantController.restaurant.findOne({_id:req.params.restaurantId},(err,data)=>{
                 const a = []
                 if(err){
                     throw err
                 }
                 else{
                    const result = data.foodList.map((x)=>{
                         if(x._id.toString()===req.params.foodId.toString()){
                             console.log(x.deleteFlag);
                             x.deleteFlag = true
                        }
                        return x
                     })
                     console.log(result);
                     restaurantController.restaurant.findOneAndUpdate({_id:req.params.restaurantId},{$set:{foodList:result}},{new:true},(err,data)=>{
                         if(err){
                             throw err
                         }
                         else{
                             res.status(400).send({message:data})
                         }
                     })
                 }
               
             })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const filterFoodByPriceLowToHigh = (req,res)=>{
    try{
        if(req.query.latitude && req.query.longitude){
            restaurantController.menu.aggregate([{$sort:{foodPrice:1}},{$project:{"restaurantDetails.foodList":0}}],(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    if(data.length!=0){
                        const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
                        if(datas.length!=0){
                            console.log(datas.length)
                            res.status(200).send({message:datas})
                        }
                        else{
                            res.status(400).send({message:"data not found"})
                        }
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
                }
            })
        }
        else{
            res.status(400).send({message:"please send latitude,longitude as query format"})
        }
         
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
    
}


const filterFoodByPriceHighToLow = (req,res)=>{
    try{
        if(req.query.latitude && req.query.longitude){
            restaurantController.menu.aggregate([{$sort:{foodPrice:-1}},{$project:{"restaurantDetails.foodList":0}}],(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
                    if(datas.length!=0){
                        console.log(datas.length)
                        res.status(200).send({message:datas})
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
                }
            })
        }
        else{
            res.status(400).send({message:"please send lattitude, longitude as query format"})
        }
       
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getCategoryList = (req,res)=>{
    try{
        if(req.query.latitude && req.query.longitude){
         restaurantController.menu.find({deleteFlag:"false"},(err,data)=>{
             if(err){
                 throw err
             }
             else{
                // console.log("line 733",data);
                const datas=data.filter(((result)=>filterLocationForFood(result,5000,req.query.latitude,req.query.longitude)))
                console.log("line 739",datas)
                if(datas.length!=0){
                    var arr = []
                    datas.map((x)=>{
                        // console.log(x.cuisine)
                        arr.push(x.cuisine)
                    })
                    // console.log(arr)
                    var arr1 = []
                    var counts ={}
            
                    arr.forEach(function (x){ 
                        counts[x] = (counts[x] || 0) + 1; 
                        });
                    // console.log(counts)
                    var removeDuplicates = [...new Set(arr)]; 
                    removeDuplicates.map((x)=>{
                        // console.log(x);
                        const object = {category:x}
                        arr1.push(object)
                    })
                    //  console.log(arr1);
                    arr.forEach(function (x){ 
                        counts[x] = (counts[x] || 0) + 1; 
                        });
                    // console.log(counts)
                    res.status(200).send({message:removeDuplicates})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
               
             }
        })
        }
        else{
            res.status(400).send({message:"please send lattitude, longitude as query format"})
        }
    }catch(err){
        res.status(500).send({message:err.message})
    }
   
}


function filterLocationForFood(result,radius,latitude,longitude)
    {
      console.log("----------",result.restaurantDetails);
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

//Restaurant Review


const createRestaurantReview = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
                if(err){
                    throw err
                }
                else{
                    console.log(data1)
                    if(data1.length!=0){
                        req.body.userId = data1._id
                        req.body.userName = data1.name
                        restaurantController.restaurantReview.create(req.body,(err,data2)=>{
                            if(err) {
                                throw err
                            }
                            else{
                                console.log(data2);
                                res.status(200).send({message:data2})
                                restaurantController.restaurant.findOne({_id:data2.restaurantId},(err,data)=>{
                                    if(err){
                                        throw err
                                    }
                                    else{
                                        if(data.length!=0){
                                            console.log("--------------------",data.reviewCount);
                                            var array = []
                                            data.review.map((x)=>{
                                                console.log(x);
                                                array.push(x)
                                            })
                                            array.push(req.body)
                                            console.log(array);
                                            const count = array.length
                                            console.log(count);
                                            restaurantController.restaurant.findOneAndUpdate({_id:data2.restaurantId},{$set:{review:array,reviewCount:count}},{new:true},(err,data)=>{
                                                if(err){
                                                    throw err
                                                }
                                                else{
                                                    console.log(data)
                                                    // res.status(200).send({message:data})
                                                } 
                                            })
                                        }
                                        else{
                                            res.status(400).send({message:"data not found"})
                                        }
                                        
                                    }
                                })
                            }
                           
                        })
                    }
                    else{
                        res.status(400).send({message:"Invalid token,data not found"})
                    }
                }
               
            })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
} 


const getRestaurantReview = (req,res)=>{
    try{
        restaurantController.restaurantReview.find({restaurantId:req.params.id},(err,data)=>{
            if(err) {
                throw err
            }
            else{
                if(data.length!=0){
                    var count=data1.length
                    console.log(count)
                    const data1=paginated.paginated(data,req,res)
                    res.status(200).send({message:data1,count})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

// Rating

const restaurantRating = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
                if(err){
                    throw err
                }
                else{
                    console.log(data1)
                    if(data1.length!=0){
                        req.body.userId = data1._id
                        restaurantController.restaurantRating.create(req.body,(err,data2)=>{
                            if(err){ 
                                throw err
                            }
                            else{
                                res.status(200).send({message:data2})
                            }
                        })
                    }
                    else{
                        res.status(400).send({message:"data not found"})
                    }
                }
               
            })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
   
}


const searchAPI = (req,res)=>{
    console.log("1");
    try{
        restaurantController.restaurant.find({deleteFlag:"false"},(err,data)=>{
            if(err){
                throw err
            }
            else{
                console.log("-----------------------",data);
                const datas=data.filter(((result)=>filterLocation(result,5000,req.query.latitude,req.query.longitude)))
                if(datas.length!=0){
                    req.body.data = datas
                    responseController.responseRestaurant.create(req.body,(err,data1)=>{
                        if(err){
                            throw err
                        }
                        else{
                            console.log("line 547",data1)
                            responseController.responseRestaurant.aggregate([{$match:{_id:data1._id}},{ $unwind:"$data"},{$match:{$or:[{"data.restaurantName":req.params.key},{"data.foodList.foodName":req.params.key}]}},{$project:{"data.foodList.restaurantDetails":0}},{ $group: {
                                _id: "$_id",
                                data: { $push: "$data" }
                                }}],(err,data)=>{
                                if(err){ 
                                    throw err
                                }
                                else{
                                    if(data.length!=0){
                                        console.log(data)
                                        res.status(200).send({message:data})
                                    }
                                    else{
                                        res.status(400).send({message:"data not found"})
                                    }
                                }
                               
                            }) 
                        }
                       
                    })
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
                
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}





module.exports={
    image,
    getLatLongByLocation,
    createRestaurant,
    updateRestaurantWithFood,
    getSpecificRestaurant,
    getOneRestaurantById,
    updateRestaurant,
    removeRestaurant,
    getRestaurantByLocation,
    getRestaurantLocationByOffer,
    getRestaurantLocationByRating,
    getRestaurantLocationByRating1,
    addFood,
    getAllFood,
    updateMenu,
    deleteMenu,
    getFoodByOwner,
    updateFood,
    deleteFood,
    filterFoodByPriceLowToHigh,
    filterFoodByPriceHighToLow,
    getCategoryList,
    filterFood,
    createRestaurantReview,
    getRestaurantReview,
    restaurantRating,
    searchAPI,
    getAllRestaurant
}