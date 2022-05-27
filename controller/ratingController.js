const ratingController = require('../model/ratingSchema')
const adminController = require('../model/adminSchema')
const restaurantController = require('../model/restaurantSchema')
const wishListController = require('../model/wishListSchema')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



const foodQualityRating = (req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        ratingController.foodQualityRating.create(req.body,(err,data1)=>{
            console.log(data1)
            ratingController.foodQualityRating.countDocuments({restaurantId:data1.restaurantId},(err,num)=>{
                console.log(num)
                const noOfPersons = num
                ratingController.foodQualityRating.find({restaurantId:data1.restaurantId},{rating:1,_id:0},(err,data2)=>{
                    console.log(data2)
                    console.log(typeof data2);
                        let a = 0;
                        for (var i = 0; i < data2.length; i++) {
                          a += data2[i].rating;
                        }
                        console.log(a);
                        const average = a / noOfPersons;
                        console.log(average)
                        console.log(parseFloat(average).toFixed(2));
                        const foodQualityRating = parseFloat(average).toFixed(2)
                        req.body.userId = verify
                        restaurantController.restaurantRating.create(req.body,(err,data)=>{
                            console.log(data)
                            restaurantController.restaurantRating.findOneAndUpdate({restaurantId:req.body.restaurantId},{$set:{foodQuality:foodQualityRating}},{new:true},(err,data3)=>{
                            console.log(data3)
                            res.status(200).send({message:data3})
                        })
                        })
                        
                })
            })   
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
   
}


const locationRating = (req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        ratingController.locationRating.create(req.body,(err,data1)=>{
            console.log(data1)
            ratingController.locationRating.countDocuments({restaurantId:data1.restaurantId},(err,num)=>{
                console.log(num)
                const noOfPersons = num
                ratingController.locationRating.find({restaurantId:data1.restaurantId},{rating:1,_id:0},(err,data2)=>{
                    console.log(data2)
                    console.log(typeof data2);
                        let a = 0;
                        for (var i = 0; i < data2.length; i++) {
                          a += data2[i].rating;
                        }
                        console.log(a);
                        const average = a / noOfPersons;
                        console.log(average)
                        console.log(parseFloat(average).toFixed(2));
                        const locationRating = parseFloat(average).toFixed(2)
                        req.body.userId = verify
                        restaurantController.restaurantRating.create(req.body,(err,data)=>{
                            restaurantController.restaurantRating.findOneAndUpdate({restaurantId:req.body.restaurantId},{$set:{location:locationRating}},{new:true},(err,data3)=>{
                                console.log(data3)
                                res.status(200).send({message:data3})
                            })
                    })  
                })  
            })   
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
  
}


const priceRating = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    ratingController.priceRating.create(req.body,(err,data1)=>{
        console.log(data1)
        ratingController.priceRating.countDocuments({restaurantId:data1.restaurantId},(err,num)=>{
            console.log(num)
            const noOfPersons = num
            ratingController.priceRating.find({restaurantId:data1.restaurantId},{rating:1,_id:0},(err,data2)=>{
                console.log(data2)
                console.log(typeof data2);
                    let a = 0;
                    for (var i = 0; i < data2.length; i++) {
                      a += data2[i].rating;
                    }
                    console.log(a);
                    const average = a / noOfPersons;
                    console.log(average)
                    console.log(parseFloat(average).toFixed(2));
                    const priceRating = parseFloat(average).toFixed(2)
                    req.body.userId = verify
                    restaurantController.restaurantRating.create(req.body,(err,data)=>{
                        restaurantController.restaurantRating.findOneAndUpdate({restaurantId:req.body.restaurantId},{$set:{price:priceRating}},{new:true},(err,data3)=>{
                            console.log(data3)
                            res.status(200).send({message:data3})
                        })
                })
            })
        })   
    })
}

const serviceRating = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    ratingController.serviceRating.create(req.body,(err,data1)=>{
        console.log(data1)
        ratingController.serviceRating.countDocuments({restaurantId:data1.restaurantId},(err,num)=>{
            console.log(num)
            const noOfPersons = num
            ratingController.serviceRating.find({restaurantId:data1.restaurantId},{rating:1,_id:0},(err,data2)=>{
                console.log(data2)
                console.log(typeof data2);
                    let a = 0;
                    for (var i = 0; i < data2.length; i++) {
                      a += data2[i].rating;
                    }
                    console.log(a);
                    const average = a / noOfPersons;
                    console.log(average)
                    console.log(parseFloat(average).toFixed(2));
                    const serviceRating = parseFloat(average).toFixed(2)
                    req.body.userId = verify
                    restaurantController.restaurantRating.create(req.body,(err,data)=>{
                        restaurantController.restaurantRating.findOneAndUpdate({restaurantId:req.body.restaurantId},{$set:{service:serviceRating}},{new:true},(err,data3)=>{
                            console.log(data3)
                            res.status(200).send({message:data3})
                        })
                })
            })
        })   
    })
}

const ratingForRestaurant = (req,res)=>{
    try{
        restaurantController.restaurantRating.findOne({restaurantId:req.query.id},{_id:0,restaurantId:0,userId:0,__v:0},(err,data)=>{
            console.log(typeof(data.foodQuality))
            const values = data.foodQuality+data.location+data.price+data.service
            const average = values/4
            console.log(average)
            if(average>=9){
                restaurantController.restaurant.findOneAndUpdate({_id:req.query.id},{$set:{ratingValue:average,rating:"Superb"}},{new:true},(err,data1)=>{
                    if(err) throw err
                     console.log(data1)
                     res.status(200).send({message:data1})
                })
            }
            else if(average>=8){
                restaurantController.restaurant.findOneAndUpdate({_id:req.query.id},{$set:{ratingValue:average,rating:"Very Good"}},{new:true},(err,data1)=>{
                    if(err) throw err
                     console.log(data1)
                     res.status(200).send({message:data1})
                })
            }
            else if(average>=7){
                restaurantController.restaurant.findOneAndUpdate({_id:req.query.id},{$set:{ratingValue:average,rating:"Good"}},{new:true},(err,data1)=>{
                    if(err) throw err
                     console.log(data1)
                     res.status(200).send({message:data1})
                })
            }
            else{
                restaurantController.restaurant.findOneAndUpdate({_id:req.query.id},{$set:{ratingValue:average,rating:"Pleasant"}},{new:true},(err,data1)=>{
                    if(err) throw err
                     console.log(data1)
                     res.status(200).send({message:data1})
                })
            }
       
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
    
}

const createInterestedPersons=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            console.log(token)
            const verify = token.userid
            console.log(verify)
            const user=await wishListController.wishList.aggregate([{$match:{}},{$unwind:{path:"$restaurantDetails"}},{$unwind:{path:"$userDetails"}},{$match:{$and:[{"restaurantDetails._id":new mongoose.Types.ObjectId(req.params.restaurantId)},{"userDetails._id":new mongoose.Types.ObjectId(token.userid)}]}}])
            console.log(user.length)
            if(user.length==0){
               if(req.body.interested=="true"){
               console.log("inside if")
               const user =await adminController.adminSchema.findOne({_id:verify,deleteFlag:false})
               req.body.userDetails=user
               console.log(req.body.userDetails);
               const restaurant=await restaurantController.restaurant.findOne({_id:req.params.restaurantId,deleteFlag:false})   
               req.body.restaurantDetails=restaurant 
               console.log(req.body.restaurantDetails); 
               wishListController.wishList.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        res.status(200).send({success:'true',message:'created successfully',data})
                    }
                })      
                }
            }
            else{
                const data=await wishListController.wishList.findByIdAndUpdate({_id:user[0]._id},req.body,{new:true})
                res.status(200).send({success:'true',message:'unliked successfully',data})
            }
        }else{
            res.status(200).send({success:'false',message:'unauthorized',data})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }
}

const UserFavoriteList=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            const verify = token.userid
            console.log(verify)
            console.log(new mongoose.Types.ObjectId(token.userid))
            const data1= await wishListController.wishList.aggregate([{$match:{$and:[{"userDetails._id":new mongoose.Types.ObjectId(token.userid)},{interested:true}]}}])
            // console.log(data1)
            res.status(200).send({success:'true',message:'fetch data successfully',data1})
        }else{
            res.status(401).send({success:'false',message:'params is required',data:[]})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }    
}

// {$match:{$and:[{"userDetails._id":new mongoose.Types.ObjectId(token.userid)},{interested:"true"}]}}

module.exports={
    foodQualityRating,
    locationRating,
    priceRating,
    serviceRating,
    ratingForRestaurant,
    createInterestedPersons,
    UserFavoriteList
}