const offerController = require('../model/offerSchema')



const createOffer = (req,res)=>{
    try{
        offerController.offer.create(req.body,(err,data)=>{
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


const getOfferList = (req,res)=>{
    try{
        offerController.offer.find({},(err,data)=>{
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


const updateOffer = (req,res)=>{
    try{
        offerController.offer.findOneAndUpdate({_id:req.params.id},req.body,{new:true},(err,data)=>{
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


const deleteOffer = (req,res)=>{
    try{
        offerController.offer.findOneAndUpdate({_id:req.params.id},{$set:{deleteFlag:"true"}},{new:true},(err,data)=>{
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
    createOffer,
    getOfferList,
    updateOffer,
    deleteOffer
}