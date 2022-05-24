const mongoose = require('mongoose')


const offerSchema = mongoose.Schema({
    title:String,
    description:String,
    promoCode:String,
    offerType:String,
    discount:String,
    usageLimitPerCoupon:String,
    usageLimitPerUser:String,
    availableFrom:String,
    expiryDate:String,
    status:{
        type:String,
        default:"active"
    }
})


const offer = mongoose.model("offerSchema",offerSchema)

module.exports={
    offer
}