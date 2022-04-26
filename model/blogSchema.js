const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    blogImage:String,
    blogName:String,
    content:String,

})


const blog = mongoose.model("blogSchema",blogSchema)

module.exports={
    blog
}
