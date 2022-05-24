const mongoose = require('mongoose')


const contentSchema = mongoose.Schema({
    title:String,
    content:String,
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const faqSchema = mongoose.Schema({
    question:String,
    answer:String,
    status:{
        type:String,
        default:"active"
    },
    deleteFlag:{
        type:String,
        default:"false"
    },
    createdAt:{
        type:String,
        default:new Date()
    }
})


const subscriberSchema = mongoose.Schema({
    subscriberEmail:String,
    subscriberType:String,
})


const content = mongoose.model("contentSchema",contentSchema)
const faq = mongoose.model("faqSchema",faqSchema)
const subscriber = mongoose.model("subscriberSchema",subscriberSchema)



module.exports={
    content,
    faq,
    subscriber
}