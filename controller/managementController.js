const managementController = require('../model/managementSchema')

////////   Content

const createContent = (req,res)=>{
    try{
        managementController.content.create(req.body,(err,data)=>{
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

const getContentList = (req,res)=>{
    try{
        managementController.content.find({deleteFlag:"false"},(err,data)=>{
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

const updateContent = (req,res)=>{
    try{
        managementController.content.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"update successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const deleteContent = (req,res)=>{
    try{
        managementController.content.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"deleted successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

///////  FAQ


const createFAQ = (req,res)=>{
    try{
        managementController.faq.create(req.body,(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"created successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getFAQ = (req,res)=>{
    try{
        managementController.faq.find({deleteFlag:"false"},(err,data)=>{
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

const updateFAQ = (req,res)=>{
    try{
        managementController.faq.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"update successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const deleteFAQ = (req,res)=>{
    try{
        managementController.faq.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"deleted successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

///////////////// Subscriber

const addSubscriber = (req,res)=>{
    try{
        managementController.subscriber.create(req.body,(err,data)=>{
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
        res.status(500).send({message:err.message})
    }
}

const getSubscriberList = (req,res)=>{
    try{
        managementController.subscriber.find({},(err,data)=>{
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



module.exports={
    createContent,
    getContentList,
    updateContent,
    deleteContent,
    createFAQ,
    getFAQ,
    updateFAQ,
    deleteFAQ,
    addSubscriber,
    getSubscriberList
}