const mongoose = require('mongoose')


const categorySchema = mongoose.Schema({
    categoryName:String,
    categoryDetails:String,
})


const serviceSchema = mongoose.Schema({
    serviceName:String,
    serviceDetails:String
})

const replySchema = mongoose.Schema({
    userId:String,
    userName:String,
    content:String,
})

const reviewSchema = mongoose.Schema({
    userId:String,
    userName:String,
    content:String,
    reply:[replySchema]
})

const restaurantSchema = mongoose.Schema({
    data:Object
    // restaurantName:String,
    // restaurantEmail:String,
    // restaurantOwner:String,
    // restaurantImage:String,
    // menuImage:[String],
    // restaurantAddress:String,
    // restaurantPhoneNo:Number,
    // restaurantOwnerId:String,
    // offer:Number,
    // averagePrice:Number,
    // information:String,
    // service:[serviceSchema],
    // category:[categorySchema],
    // openingTime:{
    //     lunch:String,
    //     dinner:String
    // },
    // leaveDay:String,
    // restaurantLocation:{
    //     // type:{type:String},
    //     // coordinates: [Number]
    //     restaurantLatitude:Number,
    //     restaurantLongitude:Number
    // },
    // cuisine:[String],
    // review:[reviewSchema],
    // rating:String,
    // deleteFlag:{
    //     type:String,
    //     default:"false"
    // }
})

const responseRestaurant = mongoose.model("responseRestaurantSchema",restaurantSchema)

module.exports={
    responseRestaurant
}