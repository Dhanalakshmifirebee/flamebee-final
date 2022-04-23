const adminRequestController = require('../model/adminSchema')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')


const createAdminRequest = (req,res)=>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array() })
        }else{
            adminRequestController.adminRequest.countDocuments({email:req.body.email},async(err,data)=>{
                if(data==0){
                    if(req.body.password==req.body.confirmPassword){
                        // req.body.password = await bcrypt.hash(req.body.password,10)
                        // req.body.confirmPassword = await bcrypt.hash(req.body.confirmPassword,10)
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

const adminLogin = (req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).send({errors:errors.array()})
        }
        else{
            adminRequestController.adminRequest.findOne({email:req.body.email},async(err,data)=>{
                console.log(data)
                if(data.status=="true"){
                    var userid=data._id
                    const token=jwt.sign({userid},'secret')
                    res.status(200).send({message:"Login Successfully",data,token})
                   
                }
                else{
                    res.status(400).send({message:"Invalid email"})
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
             postMail(to,"Your Restaurant is selected","Username:"+data.userName+"\nPassword:"+data.password)
             adminRequestController.adminRequest.findOneAndUpdate({_id:req.params.id},{$set:{status:true}},{new:true},(err,data1)=>{
                 if(err) throw err
                 console.log(data1)
             })
         }
         else{
            const to = data.email
            postMail(to,"Your Restaurant is rejected","Your Restaurant is rejected")
            adminRequestController.adminRequest.findOneAndUpdate({_id:req.params.id},{$set:{status:false}},{new:true},(err,data1)=>{
                if(err) throw err
                console.log(data1)
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


module.exports={
    createAdminRequest,acceptAdmin,adminLogin
}