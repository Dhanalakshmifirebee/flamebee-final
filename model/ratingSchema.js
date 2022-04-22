const mongoose = require('mongoose')

const foodQualityRatingSchema = mongoose.Schema({
     restaurantId:String,
     rating:{
         type:Number,
         default:0
     },
     noOfPersons:{
         type:Number,
         default:0
     }
})

const locationRatingSchema = mongoose.Schema({
    restaurantId:String,
    rating:{
        type:Number,
        default:0
    },
    noOfPersons:{
        type:Number,
        default:0
    }
})

const priceRatingSchema = mongoose.Schema({
    restaurantId:String,
    rating:{
        type:Number,
        default:0
    },
    noOfPersons:{
        type:Number,
        default:0
    }
})

const serviceRatingSchema = mongoose.Schema({
    restaurantId:String,
    rating:{
        type:Number,
        default:0
    },
    noOfPersons:{
        type:Number,
        default:0
    }
})


const likeSchema=mongoose.Schema({
    restaurantId:String,
    like:{
        type:Number,
        default:0
    },
    dislike:{
        type:Number,
        default:0
    }
   
})




const foodQualityRating = mongoose.model("foodQualityRating",foodQualityRatingSchema)
const locationRating = mongoose.model("locationRatingSchema",locationRatingSchema)
const priceRating = mongoose.model("priceRatingSchema",priceRatingSchema)
const serviceRating = mongoose.model("serviceRatingSchema",serviceRatingSchema)
const like = mongoose.model("likeSchema",likeSchema)


module.exports={
    foodQualityRating,locationRating,priceRating,serviceRating,like
}