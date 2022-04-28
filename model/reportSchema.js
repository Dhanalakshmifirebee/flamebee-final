const mongoose = require('mongoose')

const reportSchema = mongoose.Schema({
    restautantName:String,
    restaurantId:String,
    image:String,
    message:String,
    userDetails:Object
})


const report = mongoose.model("reportSchema",reportSchema)

module.exports={
    report
}