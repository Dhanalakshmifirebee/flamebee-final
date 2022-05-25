const mongoose = require('mongoose')

const helpSchema = mongoose.Schema({
    topic:String,
    description:String,
    deleteFlag:{
        type:String,
        default:"false"
    }
})

const articleSchema = mongoose.Schema({
    articleName:String
}) 




const help = mongoose.model("helpSchema",helpSchema)
const article = mongoose.model("articalSchema",articleSchema)

module.exports={
    help,
    article
}