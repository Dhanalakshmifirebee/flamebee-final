const orderControll = require('../model/order_schema')
const deliveryControll = require('../model/delivery_schema')
const restaurantController = require('../model/restaurantSchema')
const geolib = require('geolib')
const paginated=require('./adminController')
const nodeGeocoder = require('node-geocoder')

const orderDetails = async(req, res) => {
    try {
         console.log(req.body)
         req.body.paymentDetails = req.body.paymentDetails
         req.body.cart = req.body.cart

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
                        // console.log(data2.count)
                        const count = data2.count + 1
                        console.log(count)
                        restaurantController.menu.findOneAndUpdate({ _id: foodId }, { $set: { count: count } }, { new: true }, (err, data3) => {
                            if(err) throw err
                            console.log(data3)
                            console.log(data1.cart)
                            var result = data1.cart
                            result.map((x)=>{
                                console.log("line 35",x)
                                // x.map((y)=>{
                                //     console.log("line 35",x.restaurantDetails)
                                //     console.log(y)
                                    const a = x.restaurantDetails.restaurantLocation.restaurantLatitude
                                    const b = x.restaurantDetails.restaurantLocation.restaurantLongitude
                                    // console.log(y.restaurantLocation.restaurantLatitude)
                                    // console.log(y.restaurantLocation.restaurantLongitude)
                                    deliveryControll.deliveryRegister.find({},(err,data)=>{
                                        console.log(data)
                                        const datas=data.filter(((result)=>filterLocation(result,22000,a,b)))
                                        res.status(200).send({success:"true",message:"nearBy Delivery Candidate Details",datas})
                                    })
                                // })
                            })
                           
                        })
                    })
                })
                // res.status(200).send({success:"true",message: 'order placed successfully',data1})
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
    console.log("data")
     deliveryControll.deliveryRegister.findOne({_id:req.params.id},(err,data)=>{
         console.log(data)
         res.status(200).send({success:"true",message:"Single delivery Candidate",data})
     })
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
            const data1=paginated.paginated(data,req,res)
            res.status(200).send({message:data1,count})
            
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
    orderStatusUpdate
}