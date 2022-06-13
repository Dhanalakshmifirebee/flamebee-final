const mongoose = require('mongoose')
const { stringify } = require('querystring')

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
    commands:[Object],
    createdAt:{
        type:String,
        // default:new Date()
    },
    deleteFlag:{
        type:String,
        default:"false"
    }
})


const commentSchema = mongoose.Schema({
    name:String,
    email:String,
    website:String,
    comment:String,
    userId:String,
    blogId:String,
    createdAt:String,
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const blog = mongoose.model("blogSchema",blogSchema)
const comment = mongoose.model("commentSchema",commentSchema)

module.exports={
    blog,
    comment
}
