const blogController = require('../model/blogSchema')
const jwt = require('jsonwebtoken')
const adminController = require('../model/adminSchema')
const moment = require('moment')
const { default: mongoose } = require('mongoose')
const { rmSync } = require('fs')


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
                    req.body.createdAt = moment(new Date()).toISOString().slice(0,10)
                    console.log(req.body.createdAt);
                    // req.body.blogImage = `http://192.168.0.112:8613/uploads/${req.file.filename}`
                    req.body.adminId = verify
                    blogController.blog.create(req.body,(err,data)=>{
                        if(err){ 
                            throw err
                        }
                        else{
                            res.status(200).send({message:data})
                        }
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
        if(token!=null){
            // const decoded = jwt.decode(token)
            // const verify = decoded.userid
            blogController.blog.find({deleteFlag:"false"},(err,data)=>{
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


const getSingleBlog = (req,res)=>{
    try{
        blogController.blog.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.blogId)}}],(err,data)=>{
            if(err){
                throw err
            }
            else{
                if(data.length!=0){
                    const count = data[0].commands.length
                    console.log(count);
                    res.status(200).send({message:data,count})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getCommentByBlogId = (req,res)=>{
    console.log("1");
    try{
        blogController.blog.aggregate([{$match:{_id:mongoose.Types.ObjectId(req.params.blogId)}}],(err,data)=>{
            if(err){
                throw err
            }
            else{
                if(data.length!=0){
                    console.log(data[0])
                    const comment = data[0].commands
                    res.status(200).send({message:comment})
                }
                else{
                    res.status(400).send({message:err.message})
                }
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const updateBlog = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
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
        if(token!=null){
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

//-------------------------------------- Comment ------------------------------------------------

const addComment = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(req.headers.authorization)
            const verify = decoded.userid
            console.log(verify);
            req.body.createdAt = moment(new Date()).toISOString().slice(0,10)
            console.log(req.body.createdAt)
            req.body.userId = verify
            req.body.blogId = req.params.blogId
            blogController.comment.create(req.body,(err,data)=>{
                if(err){ 
                    throw err
                }
                else{
                    res.status(200).send({message:data})
                    console.log(data);
                    blogController.blog.findOne({_id:data.blogId},(err,data)=>{
                        if(err){
                            throw err
                        }
                        else{
                            console.log(data);
                            var array = []
                            data.commands.map((x)=>{
                                console.log(x);
                                array.push(x)
                            })
                            array.push(req.body)
                            console.log(array);
    
                            blogController.blog.findOneAndUpdate({_id:req.body.blogId},{$set:{commands:array}},{new:true},(err,data)=>{
                                if(err){
                                    throw err
                                }
                                else{
                                    console.log(data)
                                    // res.status(200).send({message:data})
                                } 
                            })
                        }
                    })
                }
            })
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getComment = (req,res)=>{
    try{
        blogController.comment.find({deleteFlag:"false"},(err,data)=>{
            console.log(data);
            if(err){ 
                throw err
            }
            else{
                if(data.length!=0){
                    res.status(200).send({message:data})
                }
                else{
                    res.status(400).send({message:"data not found"})
                }
            }
        })
       
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


module.exports={
    createBlog,
    getBlog,
    getSingleBlog,
    
    updateBlog,
    deleteBlog,
    unsetField,
    addComment,
    getComment,
    getCommentByBlogId
}