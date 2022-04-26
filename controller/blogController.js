const blogController = require('../model/blogSchema')


const createBlog = (req,res)=>{
    try{
        blogController.blog.create(req.body,(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getBlog = (req,res)=>{
    try{
        blogController.blog.find({},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}







module.exports={
    createBlog,getBlog
}