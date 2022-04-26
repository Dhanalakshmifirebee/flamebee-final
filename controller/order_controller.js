const orderControll = require('../model/order_schema')
const deliveryControll = require('../model/delivery_schema')
const restaurantController = require('../model/restaurantSchema')
const geolib = require('geolib')

const orderDetails = (req, res) => {
    try {
          orderControll.order.create(req.body, (err, data1) => {
                if (err) throw err
                data1.foodSchema.map((x) => {
                    console.log(x.foodId)
                    var foodId = x.foodId
                    restaurantController.menu.findOne({ _id: foodId }, (err, data2) => {
                        // console.log(data2.count)
                        const count = data2.count + 1
                        console.log(count)
                        restaurantController.menu.findOneAndUpdate({ _id: foodId }, { $set: { count: count } }, { new: true }, (err, data3) => {
                            if(err) throw err
                            console.log(data1.foodSchema)
                            var result = data1.foodSchema
                            result.map((x)=>{
                                console.log(x)
                                x.restaurantDetails.map((y)=>{
                                    console.log(y)
                                    const a = y.restaurantlocation.restaurantLatitude
                                    const b = y.restaurantlocation.restaurantLongitude
                                    console.log(y.restaurantlocation.restaurantLatitude)
                                    console.log(y.restaurantlocation.restaurantLongitude)
                                    deliveryControll.deliveryRegister.find({},(err,data)=>{
                                        console.log(data)
                                        const datas=data.filter(((result)=>filterLocation(result,22000,a,b)))
                                        res.status(200).send({success:"true",message:"nearBy Delivery Candidate Details",datas})
                                    })
                                })
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


// restaurantController.menu.findOneAndUpdate({foodName:data.foodSchema.foodName},{$set:{count:count+1}},{new:true},(err,data)=>{
//     console.log(data)
// })
// orderControll.order.findOneAndUpdate({_id:data.id},{$set:{"data.foodSchema.count":count}},{new:true},(err,data)=>{
//     console.log(data)
//     res.status(200).send({message: data})
// })


// const foodName = req.body.foodSchema
// foodName.map((x)=>{
//    console.log("line 9",x.foodName)
//    var y = x.foodName
//    orderControll.order.findOne({"foodSchema.foodName":y},(err,data)=>{
//     console.log(data)
//     if(data==0){
//         orderControll.order.create(req.body, (err, data) => {
//             console.log(data)
//             if (err) throw err
//             res.status(200).send({ message: data})
//         })
//     }
//     else{
//         orderControll.order.fi(req.body, (err, data) => {
//             console.log(data)
//             if (err) throw err
//             res.status(200).send({ message: data})
//         })
//     }
//    })
// })
// console.log("line 13",arr)


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
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}



module.exports = {
    orderDetails, getAllOrderAcceptedDetails, getAllOrderDetails, getSingleOrderDetails,
    adminUpdateOrderDetails, deliveryCandidateUpdateStatusDetails, deliveryCandidateUpdateOrderDetails,popularFood,getSingleDeliveryCandidate
}