const res = require('express/lib/response')
const helpController = require('../model/help&supportSchema')

const createTopic = (req,res)=>{
    try{
        console.log("data");
        helpController.help.create(req.body,(err,data)=>{
            console.log(data);
            if(err){
               throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getTopicList =(req,res)=>{
    try{
        helpController.help.find({},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({message:"data not found"})
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const updateTopic = (req,res)=>{
    try{
        helpController.help.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new:true},(err,data)=>{
            if(err){
               throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const deleteTopic = (req,res)=>{
    try{
        helpController.help.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const createArticle = (req,res)=>{
    try{
        console.log("data");
        helpController.article.create(req.body,(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getArticle = (req,res)=>{
    try{
        helpController.article.find({},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

module.exports={
    createTopic,
    getTopicList,
    updateTopic,
    deleteTopic,
    createArticle,
    getArticle
}