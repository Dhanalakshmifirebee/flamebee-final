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


const adminPackageSchema =mongoose.Schema({
    packageName:String,
    amount:Number,
    packagePlan :String,
    description:String,
    addAccess:Number,
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const contactSchema = mongoose.Schema({
    superAdminId:String,
    helpCenter:{
        phoneNo:Number,
        email:String,
        time:String
    },
    location:{
        address:String,
        time:String
    },
    submission:{
        phoneNo:Number,
        email:String,
        time:String
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const register=mongoose.model('superAdmin',registerSchema)
const adminPackage = mongoose.model("adminPackageSchema",adminPackageSchema)
const contact = mongoose.model('contactSchema',contactSchema)

module.exports={register,adminPackage,contact}