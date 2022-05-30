const deliveryController = require('../model/delivery_schema')
const orderControll = require('../model/order_schema')
const nodemailer = require('nodemailer')
const { body } = require('express-validator')
const makeId=require('../controller/random_string')
const jwt = require('jsonwebtoken')



const deliveryRegister = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.findOne({email:req.body.email},(err,data)=>{
            console.log(data);
            if(data==null){
                const unique = makeId.makeId(6)
                console.log("line12",unique)
                const date = Date.now().toString()
                console.log("line14",date)
                req.body.deliveryCandidateId = unique + date   
                deliveryController.deliveryCandidateRegister.create(req.body,(err,data)=>{
                     if(err){
                         throw err
                     }
                     else{
                         console.log(data);
                         res.status(200).send({message:"Register successfully",data})
                     }
                })
            }
            else{
                res.status(400).send({message:"email id already exists"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const deliveryLogin = (req,res)=>{
    try{
        deliveryController.deliveryCandidateRegister.aggregate([{$match:{$and:[{deliveryCandidateId:req.body.id},{status:"active"},{deleteFlag:"false"}]}}],(err,data)=>{
            if(data.length!=0){
                console.log(data[0]);
                const token = jwt.sign({userid:data[0]._id},"secret")
                console.log(token);

                res.status(200).send({message:"login successfully",data,token})
            }
            else{
                res.status(400).send({message:"Invalid candidate id"})
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
                const to = data.email
                const id = data.deliveryCandidateId
                postMail(to,"FlameBee","Your are selected for this job \nYour candidate id is "+id)
                deliveryController.deliveryCandidateRegister.findOneAndUpdate({_id:req.params.id},{$set:{status:"active"}},{new:true},(err,data1)=>{
                    if(err) throw err
                    console.log(data1)
                    res.status(200).send({message:data1})
                })
            }
            if(req.body.role=="reject"){
                const to = data.emailAddress
                postMail(to,"FlameBee","Your are not selected for this job")
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

const acceptOrderByDeliveryCandidate = (req,res)=>{
    try{
      const token = req.headers.authorization
        if(token!=null){
            const decoded = jwt.decode(token)
            const verify = decoded.userid
            orderControll.order.findOne({_id:req.params.id},(err,data)=>{
                console.log(data);
                if(req.body.role=="accept"){
                    req.body.orderdetails = data
                    console.log("line 177",req.body.orderdetails);
                    deliveryController.deliveryCandidateRegister.findOneAndUpdate({_id:verify},req.body,{new:true},(err,data)=>{
                        console.log(data);
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
         
            
            res.status(400).send({message:"unAuthorized"})
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const acceptanceOrderCount = (req,res)=>{
    try{
        const token = req.headers.authorization
        if(token!=null){
             const decoded = jwt.decode(token)
             const verify = decoded.userid
             deliveryController.deliveryCandidateRegister.findOne({_id:verify},(err,data)=>{
                 if(err){
                     throw err
                 }
                 else{
                    console.log(data);
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


module.exports={
    deliveryRegister,
    deliveryLogin,
    getDeliveryCandidateList,
    deliveryCandidateSelection,
    getApprovedCandidateList,
    getRejectedCandidateList,
    acceptOrderByDeliveryCandidate,
    acceptanceOrderCount
}