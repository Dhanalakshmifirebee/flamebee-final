const blogController = require('../model/blogSchema')
const jwt = require('jsonwebtoken')
const adminController = require('../model/adminSchema')


const createBlog = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(req.headers.authorization)
            const verify = decoded.userid
            console.log(verify);
            adminController.adminRequest.findOne({_id:verify},(err,data)=>{
                console.log(data);
                if(data){
                    req.body.adminId = verify
                    blogController.blog.create(req.body,(err,data)=>{
                        if(err) throw err
                        console.log(data)
                        res.status(200).send({message:data})
                    })
                }
            })
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getBlog = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!==null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            blogController.blog.findOne({adminId:verify,deleteFlag:"false"},(err,data)=>{
                console.log(data);
                if(err) throw err
                res.status(200).send({message:data})
            })
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const updateBlog = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!==null){
            blogController.blog.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,data)=>{
                if(err) throw err
                res.status(200).send({message:"update Successfully",data})
            })
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
    }
    catch(err){
        res.status(400).send({message:err})
    }
}


const deleteBlog = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!==null){
            blogController.blog.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
                if(err) throw err
                res.status(200).send({message:"deleted Successfully",data})
            })
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
    }
    catch(err){
        res.status(400).send({message:err})
    }
}

const unsetField = (req,res)=>{ 
    try{
        console.log("1");
        blogController.blog.aggregate([{$unset:"commands.reply.content"}],(err,data)=>{
            if(err){
                throw err
            }
           console.log(data)
           res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}
    


module.exports={
    createBlog,
    getBlog,
    updateBlog,
    deleteBlog,
    unsetField
}