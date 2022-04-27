const mongoose=require('mongoose')

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


module.exports={deliveryRegister}