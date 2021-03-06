const mongoose = require('mongoose')
const { body } = require('express-validator')

const registerSchema = mongoose.Schema({
    name: String,
    email: String,
    contact:Number
})


const otpSchema = mongoose.Schema({
    otp: Number
})


const forgotPassword = mongoose.Schema({
    confirmPassword: {
        type: String
    },
    email: {
        type: String,
    },
    password: {
        type: String
    }
})


const adminRequestSchema = mongoose.Schema({
    name:String,
    email:String,
    restaurantName:String,
    restaurantAddress:String,
    restaurantCity:String,
    restaurantCountry:String,
    userName:String,
    password:String,
    confirmPassword:String,
    bankDetails:{
        bankName:String,
        accountNumber:Number,
        ifscCode:String,
        panNumber:String
    },
    status:{
        type:String,
        default: 0
    },
    subscriptionPlan:{
        type:String,
        default:0
    },
    paymentStatus:{
        type:String,
        default:"free"
    },
    subscriptionStartDate:{
        type:String,
        default:0
    },
    subscriptionEndDate:{
        type:String,
        default:0
    },
    validityDays:{
        type:String,
        default:0
    },
    planStatus:{
        type:String,
        default:0
    },
    free:{
        type:String,
        default:"false"
    },
    addAccess:{
        type:Number,
        default:0
    }
})


const packagePlan = mongoose.Schema({
    adminId:String,
    packageDetails:Object,
    status:String,
    // createdAt:{
    //     type:String,
    //     default:new Date()
    // },
    expiredDate:String,
    validityDays:Number
    
})

const commandSchema = mongoose.Schema({
    name:String,
    email:String,
    website:String,
    command:String
})


const adminSchema = mongoose.model('registerSchema', registerSchema)
const sendOtp = mongoose.model('sendOtpSchema', otpSchema)
const loginSchema = mongoose.model("loginSchema", forgotPassword)
const command = mongoose.model('commandSchema',commandSchema)

const adminRequest = mongoose.model('adminRequestSchema',adminRequestSchema)
const packagePlanSchema = mongoose.model('packagePlanSchema',packagePlan)


const validation = [
    body('email').trim().isEmail().withMessage('email  must be valid'),
    // body('password').isLength({ min: 2}).withMessage('password is required')
]


module.exports = { 
    adminSchema, 
    validation, 
    loginSchema,
    sendOtp,
    adminRequest,
    packagePlanSchema,
    command
}