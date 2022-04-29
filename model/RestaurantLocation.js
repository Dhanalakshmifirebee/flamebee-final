const mongoose = require("mongoose")

const locationSchema = mongoose.Schema({
    location:String,
    locationLatLong:{
        latitude:Number,
        longitude:Number
    }
})


const location = mongoose.model("locationSchema",locationSchema)

module.exports={
    location
}