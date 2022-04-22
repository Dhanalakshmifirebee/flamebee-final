const mongoose = require('mongoose')


const wishListSchema = mongoose.Schema({
    createdAt:{
        type:String,
        default:new Date()
    },
    userDetails:{
        type:Object
    },
    restaurantDetails:{
        type:Object
    },
    interested:{
        type:Boolean,
        default:false
    }
})


const wishList = mongoose.model("wishListSchema",wishListSchema)

module.exports={
    wishList
}