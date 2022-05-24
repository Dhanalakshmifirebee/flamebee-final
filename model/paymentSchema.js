const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    name:String,
    email:String,
    contact:Number,
    userId:String,
    address:String,
    userId:String,
    userLocation:{
        userLatitude:String,
        userLongitude:String
    },
    totalAmount:Number,
    role:{
        type:String,
        defalut:"cash"
    },
    status:{
        type:String,
        default:"pending"
    },
    foodSchema:[Object]
    
})


const packagePaymentSchema = mongoose.Schema({
     orderId:String,
     adminId:String,
     subscriptionPlan:String,
     packageAmount:{
         type:String,
         default:0
     },
     subscriptionStartDate:String,
     subscriptionEndDate:String
})


const payment = mongoose.model("paymentSchema",paymentSchema)
const packagePayment = mongoose.model("packageSchema",packagePaymentSchema)

module.exports={
      payment,packagePayment
}