const mongoose = require('mongoose')

const registerSchema = mongoose.Schema({
    userName: String,
    email: String,
    password: String,
    role:{
        type:String,
        default:"superAdmin"
    }
})

const packageDetails = mongoose.Schema({
    packageName:String,
    packageDays:Number,
    packagePlan :String,
    restaurantCount:Number

})

const adminPackageSchema =mongoose.Schema({
    package:[packageDetails]
    
})

const register=mongoose.model('superAdmin',registerSchema)
const adminPackage = mongoose.model("adminPackageSchema",adminPackageSchema)


module.exports={register,adminPackage}