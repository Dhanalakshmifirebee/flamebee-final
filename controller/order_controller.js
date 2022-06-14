const orderControll = require('../model/order_schema')
const deliveryControll = require('../model/delivery_schema')
const restaurantController = require('../model/restaurantSchema')
const geolib = require('geolib')
const paginated=require('./userController')
const nodeGeocoder = require('node-geocoder')
const jwt = require('jsonwebtoken')
const moment = require("moment")


const orderDetails = async(req, res) => {
    try {
        req.body.paymentDetails = req.body.paymentDetails
        req.body.cart = req.body.cart
        const date =moment(new Date()).toISOString().slice(0,10)
         console.log('line 15',date);
         req.body.date = date
         let options = { provider: 'openstreetmap'}
         let geoCoder = nodeGeocoder(options);
         const convertAddressToLatLon=await(geoCoder.geocode(req.body.userAddress))
         req.body.userLocation = {"userLatitude":convertAddressToLatLon[0].latitude,"userLongitude":convertAddressToLatLon[0].longitude}
          orderControll.order.create(req.body, (err, data1) => {
                if (err) throw err
                console.log(data1)
                data1.cart.map((x) => {
                    console.log(x._id)
                    var foodId = x._id
                    restaurantController.menu.findOne({ _id: foodId }, (err, data2) => {
                         const count = data2.count + 1
                         restaurantController.menu.findOneAndUpdate({ _id: foodId }, { $set: { count: count } }, { new: true }, (err, data3) => {
                            if(err) throw err
                             var result = data1.cart
                            result.map((x)=>{
                                    const a = x.restaurantDetails.restaurantLocation.restaurantLatitude
                                    const b = x.restaurantDetails.restaurantLocation.restaurantLongitude
                                    deliveryControll.deliveryRegister.find({},(err,data)=>{
                                       const datas=data.filter(((result)=>filterLocation(result,22000,a,b)))
                                       res.status(200).send({success:"true",message:"nearBy Delivery Candidate Details",datas})
                                    })
                            })
                           
                        })
                    })
                })
            })
    } catch (err) {
            res.status(500).send({ message: err.message })
    }
}      



function filterLocation(result,radius,latitude,longitude)
    {
      if (!result.deliveryCandidateLocation){ 
        return false;
      }
      console.log('line 21',result.deliveryCandidateLocation.deliveryCandidateLatitude);
      console.log('line 22',result.deliveryCandidateLocation.deliveryCandidateLongitude);
      var x = geolib.isPointWithinRadius(
        {
          latitude: result.deliveryCandidateLocation.deliveryCandidateLatitude,
          longitude: result.deliveryCandidateLocation.deliveryCandidateLongitude
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


const getSingleDeliveryCandidate = (req,res)=>{
    try{
        console.log("data")
        deliveryControll.deliveryRegister.findOne({_id:req.params.id},(err,data)=>{
            console.log(data)
            res.status(200).send({success:"true",message:"Single delivery Candidate",data})
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
    
}


const getAllOrderDetails = (req, res) => {
    try {
        orderControll.order.find({ deleteFlag: 'false' }, (err, data) => {
            if (err) throw err
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}



const getSingleOrderDetails = (req, res) => {
    try {
        orderControll.order.findOne({ _id: req.params.id, deleteFlag: "false" }, (err, data) => {
            if (err) throw err
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}



const adminUpdateOrderDetails = (req, res) => {
    //  var deliveryDetails={}
    try {
        console.log(req.query.deliveryCandidateId)
        deliveryControll.deliveryRegister.findOne({ _id: req.query.deliveryCandidateId, deleteFlag: "false" }, { name: 1, contact: 1 }, (err, data) => {
            console.log("line 18", data)
            if (data) {
                req.body.deliveryCandidateName = data.name,
                req.body.candidateContactNumber = data.contact
                req.body.orderStatus = "orderAccepted"
                console.log("line 23", req.body)
                orderControll.order.findOneAndUpdate({ _id: req.query.orderId, deleteFlag: "false" }, req.body, { new: true }, (err, datas) => {
                    if (err) throw err
                    console.log("line 26", datas)
                    res.status(200).send({ message: "update order details", datas })
                })
            } else {
                res.status(400).send("invalid Id")
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


const deliveryCandidateUpdateStatusDetails = (req, res) => {
    try {
        deliveryControll.deliveryRegister.findOne({ _id: req.query.deliveryCandidateId, deleteFlag: "false" }, (err, data) => {
            console.log("line 36", data)
            if (data) {
                var Location = {}
                console.log(data.deliveryLocation)
                console.log(data.name)
                Location.deliveryLatitude = data.deliveryLocation.deliveryLatitude
                Location.deliveryLongitude = data.deliveryLocation.deliveryLongitude
                req.body.deliveryLocation = Location
                req.body.orderStatus = "orderTakeOver"
                console.log("line 40", req.body)
                orderControll.order.findOneAndUpdate({ _id: req.query.orderId, deleteFlag: "false" }, req.body, { new: true }, (err, datas) => {
                    if (err) throw err
                    console.log("line 43", datas)
                    res.status(200).send({ message: "update order details", datas })
                })
            } else {
                res.status(400).send('invalid id')
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


const getAllOrderAcceptedDetails = (req, res) => {
    try {
        // orderControll.order.find({},(err,data)=>{
        //     console.log(data)
        // })
        orderControll.order.find({}, (err, data) => {
            if (err) throw err
            res.status(200).send(data)
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}


const deliveryCandidateUpdateOrderDetails = (req, res) => {
    try {
        deliveryControll.deliveryRegister.findOne({ _id: req.query.deliveryCandidateId, deleteFlag: "false" }, (err, data) => {
            console.log("line 36", data)
            if (data) {
                //req.body.orderStatus="delivery finished"
                console.log("line 40", req.body)
                orderControll.order.findOneAndUpdate({ _id: req.query.orderId }, { $set: { deleteFlag: "true", orderStatus: "delivery finished" } }, { new: true }, (err, datas) => {
                    if (err) throw err
                    console.log("line 43", datas)
                    res.status(200).send({ message: "update order details", datas })
                })
            } else {
                res.status(400).send('invalid id')
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}


const popularFood = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{count:-1}}],(err,data)=>{
            if(err) throw err
            console.log(data)
            var count=data.length
            console.log(count)
            // const data1=paginated.paginated(data,req,res)
            res.status(200).send({message:data,count})
            
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const orderStatusUpdate = (req,res)=>{
    try{
        orderControll.order.findOneAndUpdate({_id:req.params.id},{$set:{orderStatus:req.body.orderStatus}},{new:true},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:"update successfully",data})
       })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
  
}


const cancellationReason = (req,res)=>{
    try{
        orderControll.cancellationReason.create(req.body,(err,data)=>{
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


const getCancellationList = (req,res)=>{
    try{
        orderControll.cancellationReason.find({},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({messahe:"data not found"})
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


const getPendingOrderCount = (req,res)=>{
    try{
        orderControll.order.find({orderStatus:"pending"},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({message:"data not found"})
            }
            else{
                const count = data.length
                res.status(200).send({message:count})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getFinishedOrderCount = (req,res)=>{
    try{
        orderControll.order.find({orderStatus:"finished"},(err,data)=>{
             if(err){
                 throw err
             }
             if(data.length==0){
                 res.status(400).send({message:"data not found"})
             }
             else{
                 const count = data.length
                 res.status(500).send({message:count})
             }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}



const getTodayOrderList = (req,res)=>{
    try{
         const token = req.headers.authorization
         if(token!=null){
             const decoded = jwt.decode(token)
             const verify = decoded.userid
             orderControll.order.aggregate([{$match:{$and:[{date:req.query.date},{"cart.restaurantDetails.adminId":verify}]}}],(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    res.status(200).send({message:data})
                }
            })
         }
         else{
             res.status(400).send({message:"unauthorized"})
         }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getTotalRevenue = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            console.log(verify);
            orderControll.order.aggregate([{$match:{"cart.restaurantDetails.adminId":verify}},{$group: {"_id": null,"TotalRevenue": { $sum: "$paymentDetails.amount"}}}],(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    res.status(200).send({message:data})
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


const getTodayRevenue = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            console.log(verify);
            orderControll.order.aggregate([{$match:{$and:[{date:req.query.date},{"cart.restaurantDetails.adminId":verify}]}},{$group:{"_id":null,"TodayRevenue":{$sum:"$paymentDetails.amount"}}}],(err,data)=>{
                  if(err){
                      throw err
                  }
                  else{
                      res.status(200).send({message:data})
                  }
            })
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const foodOrder = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            req.body.userId = verify
            orderControll.foodOrder.create(req.body,(err,data)=>{
                if(err){
                    throw err
                }
                else{
                    res.status(200).send({message:data})
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



// {$group:{_id:"$paymentDetails.amount"}}




module.exports = {
    orderDetails,
    getAllOrderAcceptedDetails,
    getAllOrderDetails, 
    getSingleOrderDetails,
    adminUpdateOrderDetails, 
    deliveryCandidateUpdateStatusDetails, 
    deliveryCandidateUpdateOrderDetails,
    popularFood,
    getSingleDeliveryCandidate,
    orderStatusUpdate,
    cancellationReason,
    getCancellationList,
    getPendingOrderCount,
    getFinishedOrderCount,
    getTodayOrderList,
    getTotalRevenue,
    getTodayRevenue,
    foodOrder
}