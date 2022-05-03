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

// const packageDetails = mongoose.Schema({
   
// })


const adminPackageSchema =mongoose.Schema({
    packageName:String,
    amount:Number,
    packagePlan :String,
    description:String,
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const register=mongoose.model('superAdmin',registerSchema)
const adminPackage = mongoose.model("adminPackageSchema",adminPackageSchema)


module.exports={register,adminPackage}