const mongoose = require('mongoose')
const { body } = require('express-validator')

const registerSchema = mongoose.Schema({
    name: String,
    email: String,
    contact:Number,
    password: String,
    confirmPassword:String,
    deleteFlag: {
        type: String,
        default: false
    },
    // restaurantOwned:[]
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



const adminSchema = mongoose.model('registerSchema', registerSchema)
const sendOtp = mongoose.model('sendOtpSchema', otpSchema)
const loginSchema = mongoose.model("loginSchema", forgotPassword)


const validation = [
    body('email').trim().isEmail().withMessage('email  must be valid'),
    body('password').isLength({ min: 2}).withMessage('password is required')
    
]

module.exports = { adminSchema, validation, loginSchema,sendOtp }