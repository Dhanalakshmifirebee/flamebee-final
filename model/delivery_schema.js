const mongoose=require('mongoose')
const { stringify } = require('querystring')


const licenseSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    dateOfBirth:String,
    licenseNumber:Number,
    expirationDate:String,
    licenseImage:String,
})


const insuranceSchema = mongoose.Schema({
    insuranceProvider:String,
    insurancePolicyNumber:Number,
   
})


const bankSchema = mongoose.Schema({
    bankName:String,
    accountNumber:Number
})


const deliveryCandidateRegisterSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    mobileNumber:Number,
    device:String,
    streetAddress:String,
    socialSecurityNumber:Number,
    emailAddress:String,
    password:String,
    postalCode:Number,
    state:String,
    city:String,
    vehicleType:String,
    model:String,
    licenseDetails:licenseSchema,
    insuranceDetails:insuranceSchema,
    bankDetails:bankSchema,
    status:{
        type:String,
        default:"0"
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})

 



const deliveryRegisterSchema=mongoose.Schema({
    name:String,
    email:String,
    contact:Number,
    address:String,
    gender:String,
    profileImage:String,
    drivingLicense:String,
    typeOfVehicle:String,
    qualification:String,
    jobType:String,
    deliveryCandidateId:String,
    role:{
        type:String,              
        default:'candidate'
    },
    deleteFlag:{
        type:String,
        default:false
    },
    deliveryAssigned:{
        type:String,
        default:false
    },
    deliveryCandidateLocation:{
        deliveryCandidateLatitude:{
            type:Number,
            default:0
        },
        deliveryCandidateLongitude:{
            type:Number,
            default:0
        }
    }
})



const deliveryRegister=mongoose.model("deliveryRegisterSchema",deliveryRegisterSchema)

const deliveryCandidateRegister = mongoose.model("deliveryRegister",deliveryCandidateRegisterSchema)


module.exports={
    deliveryRegister,
    deliveryCandidateRegister
}