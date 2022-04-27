const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    name:String,
    email:String,
    contact:Number,
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


const payment = mongoose.model("paymentSchema",paymentSchema)

module.exports={
      payment
}