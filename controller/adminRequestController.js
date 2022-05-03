const adminRequestController = require('../model/adminSchema')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const paginated=require('./adminController')
const paymentController = require('../model/paymentSchema')
const moment = require('moment')
const mongoose = require('mongoose')



const createAdminRequest = (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array() })
        }else{
            adminRequestController.adminRequest.countDocuments({email:req.body.email,userName:req.body.userName},async(err,data)=>{
                if(data==0){
                    if(req.body.password==req.body.confirmPassword){
                        req.body.password = await bcrypt.hash(req.body.password,10)
                        req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword,10)
                        adminRequestController.adminRequest.create(req.body,(err,data)=>{
                            if(err) throw err
                            console.log(data)
                            res.status(200).send({message:"Register Successfully",data})
                        })
                    }
                    else{
                        res.status(400).send({message:"password,confirmPassword must be same"})
                    }
                }
                else{
                    res.status(400).send({message:"email id already exists"})
                }
            })
        }
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getAdminRequest = (req,res)=>{
    adminRequestController.adminRequest.find({},(err,data)=>{
        if(err) throw err
        var count=data.length
        console.log(count)
        const datas=paginated.paginated(data,req,res)
        res.status(200).send({message:datas,count})
      

    })
}


const adminLogin = (req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()})
        }
        else{
            adminRequestController.adminRequest.findOne({userName:req.body.userName},async(err,data)=>{
                console.log(data)
                if(data!=null){
                    if(data.status=="true"){
                        var userid=data._id
                        const password = await bcrypt.compare(req.body.password, data.password)
                        if (password === true) {
                        const token=jwt.sign({userid},'secret')
                        res.status(200).send({message:"Login Successfully",data,token})
                        }
                    }
                    else{
                        res.status(400).send({message:"Invalid "})
                    }
                }
                else{
                    res.status(400).send({message:"Invalid username or password"})
                }
                
            })
        }
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}


const acceptAdmin =(req,res)=>{
    adminRequestController.adminRequest.findOne({_id:req.params.id},(err,data)=>{
        console.log(data.email)
        if(req.body.role=="accept"){
             const to = data.email
             postMail(to,"FlameBee","Your Restaurant is approved")
             adminRequestController.adminRequest.findOneAndUpdate({_id:req.params.id},{$set:{status:"true"}},{new:true},(err,data1)=>{
                 if(err) throw err
                 console.log(data1)
                 res.status(200).send({message:data1})
             })
         }
         else{
            const to = data.email
            postMail(to,"FlameBee","Your Restaurant is rejected")
            adminRequestController.adminRequest.findOneAndUpdate({_id:req.params.id},{$set:{status:"false"}},{new:true},(err,data1)=>{
                if(err) throw err
                console.log(data1)
                res.status(200).send({message:data1})
            })
         }
    })
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

const packagePlan1 =async(req,res)=>{ 
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        console.log(verify);
        const alreadyExists = await paymentController.packagePayment.aggregate([{$match:{adminId:verify}}])
        console.log(alreadyExists.length)
        if(alreadyExists.length!=0){
            console.log("inside if");
            // const adminData =  adminRequestController.adminRequest.findOne({userName:"dhanam1"})
            const adminData = await adminRequestController.adminRequest.aggregate([{$match:{_id:new mongoose.Types.ObjectId(verify)}}])
            console.log(adminData)
            const oldDate = new Date(adminData[0].subscriptionEndDate)
            const currentDate = new Date()
            const differInDays = moment(oldDate).diff(moment(currentDate),'days')
            console.log(differInDays);
            if(req.body.subscriptionPlan == "3 months"){
                req.body.validityDays = 90+differInDays
                req.body.subscriptionEndDate = moment(new Date()).add(90+differInDays,'days').toISOString()
            }
            if(req.body.subscriptionPlan == "6 months"){
                req.body.validityDays = 180+differInDays
                req.body.subscriptionEndDate = moment(new Date()).add(180+differInDays,'days').toISOString()
            }
            if(req.body.subscriptionPlan == "12 months"){
                req.body.validityDays = 365+differInDays
                req.body.subscriptionEndDate = moment(new Date()).add(365+differInDays,'days').toISOString()
            }
            req.body.adminId = verify
            const createPaymentAgain = await paymentController.packagePayment.create(req.body)
        }
        else{
            console.log("inside else")
            req.body.adminId = verify
            req.body.subscriptionStartDate = moment().format()
            const paymentCreated =await paymentController.packagePayment.create(req.body)
            console.log(paymentCreated);
            if(paymentCreated.subscriptionPlan == "Free"){
                req.body.subscriptionEndDate = moment(paymentCreated.subscriptionStartDate).add(30,'days').toISOString()
                console.log(req.body.subscriptionEndDate)
                req.body.validityDays = 30
                req.body.free = "true"
            }
            if(paymentCreated.subscriptionPlan == "3 months"){
                req.body.subscriptionEndDate = moment(paymentCreated.subscriptionStartDate).add(90,'days').toISOString()
                console.log(req.body.subscriptionEndDate)
                req.body.validityDays = 90
            }
           if(paymentCreated.subscriptionPlan == "6 months"){
                req.body.subscriptionEndDate = moment(paymentCreated.subscriptionStartDate).add(180,'days').toISOString()
                console.log(req.body.subscriptionEndDate)
                req.body.validityDays = 180
            }
            if(paymentCreated.subscriptionPlan == "12 months"){
                req.body.subscriptionEndDate = moment(paymentCreated.subscriptionStartDate).add(365,'days').toISOString()
                console.log(req.body.subscriptionEndDate)
                req.body.validityDays = 365
            }
            req.body.orderId = paymentCreated.orderId
            req.body.paymentStatus = "paid"
            req.body.planStatus="active"
        }
        const adminUpdate = await adminRequestController.adminRequest.findOneAndUpdate({_id:verify},req.body,{new:true})
        console.log(adminUpdate);
        res.status(200).send({message:"payment created Successfully"})
        // if(req.body.packageDetails.packagePlan == "Free"){
        //         var createdAt = new Date();
        //         console.log(createdAt.toLocaleString())
        //         var validityDays = 30;
        //         var result = createdAt.setDate(createdAt.getDate() + validityDays);
        //         var expiredDate = new Date(result).toLocaleString()
        //         console.log(expiredDate)
        //         req.body.expiredDate = expiredDate
        //         req.body.validityDays = validityDays
        //     packagePlanSchema.create(req.body,(err,data)=>{
        //         if(err) throw err
        //         res.status(200).send({message:data})
        //     })
        // }
        // if(req.body.packageDetails.packagePlan == "6 months"){
        //         var createdAt = new Date();
        //         console.log(createdAt.toLocaleString())
        //         var validityDays = 180;
        //         var result = createdAt.setDate(createdAt.getDate() + validityDays);
        //         var expiredDate = new Date(result).toLocaleString()
        //         console.log(expiredDate)
        //         req.body.expiredDate = expiredDate
        //         req.body.validityDays = validityDays
        //     packagePlanSchema.create(req.body,(err,data)=>{
        //         if(err) throw err
        //         res.status(200).send({message:data})
        //     })
        // }
        // if(req.body.packageDetails.packagePlan == "12 months"){
        //         var createdAt = new Date();
        //         console.log("line 326",createdAt)
        //         var validityDays = 365;
        //         var result = createdAt.setDate(createdAt.getDate() + validityDays);
        //         var expiredDate = new Date(result).toLocaleString()
        //         console.log("line 330",expiredDate)
        //         req.body.expiredDate = expiredDate
        //         req.body.validityDays = validityDays
        //     packagePlanSchema.create(req.body,(err,data)=>{
        //         if(err) throw err
        //         res.status(200).send({message:data})
        //     })
        // }
        
    }
    catch(err){
        res.status(400).send({message:err})
    }
}

const getSingleAdminPackage = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    adminRequestController.adminRequest.findOne({_id:verify},(err,data)=>{
        if(data){
            res.status(200).send({message:data})
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
        
    })
}

module.exports={
    createAdminRequest,acceptAdmin,adminLogin,getAdminRequest,packagePlan1,getSingleAdminPackage
}