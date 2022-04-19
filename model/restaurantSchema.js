const mongoose = require('mongoose')


const imageSchema = mongoose.Schema({
    image:String
})


const restaurantSchema = mongoose.Schema({
    restaurantName:String,
    restaurantEmail:String,
    restaurantOwner:String,
    restaurantImage:String,
    menuImage:[String],
    restaurantAddress:String,
    restaurantPhoneNo:Number,
    restaurantOwnerId:String,
    openingTime:{
        lunch:String,
        dinner:String
    },
    restaurantLocation:String,
    cuisine:[String],
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const menuSchema = mongoose.Schema({
    foodName:String,
    foodImage:String,
    foodPrice:Number,
    category:String,
    restaurantId:String,
    restaurantDetails:Object,
    offer:Number,
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const restaurantReviewSchema=mongoose.Schema({
    userId:String,
    userName:String,
    content:String,
    restaurantId:String,
})


const restaurantRatingSchema =mongoose.Schema({
    userId:String,
    restaurantId:String,
    rating:Number,
    foodQuality:Number,
    location:Number,
    price:Number,
    service:Number
})



const image = mongoose.model('imageSchema',imageSchema)
const restautant = mongoose.model("restaurantSchema",restaurantSchema)
const menu = mongoose.model("menuSchema",menuSchema)
const restaurantReview = mongoose.model("restaurantReviewSchema",restaurantReviewSchema)
const restaurantRating = mongoose.model("restaurantRatingSchema",restaurantRatingSchema)



module.exports={
    image,restautant,menu,restaurantReview,restaurantRating
}