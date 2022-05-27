const mongoose = require('mongoose')

const replySchema = mongoose.Schema({
    userId:String,
    userName:String,
    content:String,
})


const commandSchema = mongoose.Schema({
    userId:String,
    userName:String,
    heading:String,
    content:String,
    reply:[replySchema]
})


const blogSchema = mongoose.Schema({
    id:String,
    adminId:String,
    blogImage:String,
    blogName:String,
    content:String,
    commands:[commandSchema],
    createdAt:{
        type:String,
        default:new Date()
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const blog = mongoose.model("blogSchema",blogSchema)

module.exports={
    blog
}
