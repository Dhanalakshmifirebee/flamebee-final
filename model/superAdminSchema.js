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

const register=mongoose.model('superAdmin',registerSchema)

module.exports={register}