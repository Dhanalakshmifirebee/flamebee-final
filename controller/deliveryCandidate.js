const deliveryController = require('../model/delivery_schema')
const nodemailer = require('nodemailer')

const deliveryRegister = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.create(req.body,(err,data)=>{
            if(err){
                throw err
            }
            else{
                res.status(200).send({message:"Register Successfully",data})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const getDeliveryCandidateList = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.find({},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({message:"no data found"})
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

const deliveryCandidateSelection = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.findOne({_id:req.params.id},(err,data)=>{
            console.log(data);
            if(req.body.role=="accept"){
                const to = data.emailAddress
                postMail(to,"FlameBee","Your are selected for this job")
                deliveryController.deliveryCandidateRegister.findOneAndUpdate({_id:req.params.id},{$set:{status:"active"}},{new:true},(err,data1)=>{
                    if(err) throw err
                    console.log(data1)
                    res.status(200).send({message:data1})
                })
            }
            if(req.body.role=="reject"){
                const to = data.emailAddress
                postMail(to,"FlameBee","Your are rejected for this job")
                deliveryController.deliveryCandidateRegister.findOneAndUpdate({_id:req.params.id},{$set:{status:"inActive"}},{new:true},(err,data1)=>{
                    if(err) throw err
                    console.log(data1)
                    res.status(200).send({message:data1})
                })
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhanamcse282@gmail.com',
        pass: 'dhanam282'
    }
})

let postMail = function ( to, subject, text) {
    transport.sendMail({
        from: 'dhanamcse282@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}

const getApprovedCandidateList = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.find({status:"active"},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({message:"no data found"})
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

const getRejectedCandidateList = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.find({status:"inActive"},(err,data)=>{
            if(err){
                throw err
            }
            if(data.length==0){
                res.status(400).send({message:"no data found"})
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
    deliveryRegister,
    getDeliveryCandidateList,
    deliveryCandidateSelection,
    getApprovedCandidateList,
    getRejectedCandidateList
}