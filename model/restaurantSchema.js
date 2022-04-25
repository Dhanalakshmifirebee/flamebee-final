const mongoose = require('mongoose')


const imageSchema = mongoose.Schema({
    image:String
})
  
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
    restaurantName:String,
    restaurantEmail:String,
    restaurantOwner:String,
    restaurantImage:String,
    menuImage:[String],
    restaurantAddress:String,
    restaurantPhoneNo:Number,
    restaurantOwnerId:String,
    offer:Number,
    averagePrice:Number,
    information:String,
    service:[serviceSchema],
    category:[categorySchema],
    openingTime:{
        lunch:String,
        dinner:String
    },
    leaveDay:String,
    restaurantLocation:{
        // type:{type:String},
        // coordinates: [Number]
        restaurantLatitude:Number,
        restaurantLongitude:Number
    },
    cuisine:[String],
    review:[reviewSchema],
    ratingValue:Number,
    rating:String,
    foodList:Object,
    deleteFlag:{
        type:String,
        default:"false"
    }
})



const restaurantSchema1 = mongoose.Schema({
    restaurantName:String,
    restaurantEmail:String,
    restaurantOwner:String,
    restaurantImage:String,
    menuImage:[String],
    restaurantAddress:String,
    restaurantPhoneNo:Number,
    restaurantOwnerId:String,
    offer:Number,
    rating:Number,
    averagePrice:Number,
    information:String,
    service:[serviceSchema],
    category:[categorySchema],
    openingTime:{
        lunch:String,
        dinner:String
    },
    leaveDay:String,
    restaurantLocation:{
        type:{type:String},
        coordinates: [Number]
        // restaurantLatitude:Number,
        // restaurantLongitude:Number
    },
    cuisine:[String],
    review:[reviewSchema],
   
    deleteFlag:{
        type:String,
        default:"false"
    }
})
restaurantSchema1.index({ restaurantLocation: '2dsphere'})


const ingredientSchema = mongoose.Schema({
    ingredient:String,
    price:Number,
    status:{
        type:String,
        default:false
    }

})

const sizeSchema = mongoose.Schema({
    size:String,
    price:Number,
    status:{
        type:String,
        default:false
    }

})

const optionSchema = mongoose.Schema({
    addSize:[sizeSchema],
    addIngredient:[ingredientSchema]

})

const menuSchema = mongoose.Schema({
    foodName:String,
    foodImage:String,
    foodPrice:Number,
    category:String,
    restaurantId:String,
    restaurantDetails:Object,
    // offer:Number,
    option:[optionSchema],
    count:{
        type:Number,
        default:0
    },
    // rating:{
    //     type:String,
    //     default:0
    // },
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
    foodQuality:{
        type:Number,
        default:0
    },
    location:{
        type:Number,
        default:0
    },
    price:{
        type:Number,
        default:0
    },
    service:{
        type:Number,
        default:0
    }
})





const image = mongoose.model('imageSchema',imageSchema)
const restaurant = mongoose.model("restaurantSchema",restaurantSchema)
const restaurant1 = mongoose.model("restaurantSchema1",restaurantSchema1)

const menu = mongoose.model("menuSchema",menuSchema)
const restaurantReview = mongoose.model("restaurantReviewSchema",restaurantReviewSchema)
const restaurantRating = mongoose.model("restaurantRatingSchema",restaurantRatingSchema)
 


module.exports={
    restaurant1,
    image,restaurant,menu,restaurantReview,restaurantRating
}