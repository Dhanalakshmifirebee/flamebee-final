const { adminSchema,sendOtp,packagePlanSchema} = require('../model/adminSchema')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const fast2sms=require('fast-two-sms')
const otpRandamString=require('../controller/random_string')
const paymentController = require('../model/paymentSchema')
const moment = require('moment')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer') 



const register = async (req, res) => {
    try {
        const errors = await validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array() })
        }else {
            adminSchema.countDocuments({email:req.body.email,contact:req.body.contact}, async (err, data) => {
                console.log(data);
                if (data == 0){
                    console.log(req.body);
                    adminSchema.create(req.body, (err, result) => {
                        if(err) throw err
                        console.log(result);
                        if (result) {
                            res.status(200).send({success:"true",message: 'register successfully', data:result })

                        } else {
                            res.status(400).send({success:"false",message: 'fail to create data' })
                        }
                    })
                } else {
                    res.status(400).send({ success:"false",message: 'email is already exists' })
                }
            })
        }
    } catch (e) {
        res.status(500).send({ message: 'internal server error' })
    }

}


const login = async(req, res) => {
    try {
        if (!req.body.contact) {
            console.log('line 43',req.body.email)
            console.log('line 44',req.body.password)
            adminSchema.findOne({ email: req.body.email}, async (err, data1) => {
                if(data1){
                        const otp = otpRandamString.randomString(3)
                        console.log("otp", otp)
                        sendOtp.create({otp: otp },async (err,datas) => {
                            console.log("line 72", datas)
                            if(err){throw err}
                            if (datas) {
                                console.log("line 75", datas)
                                const to = req.body.email
                                postMail(to,"FlameBee","Please use the following OTP to verify your email:  "+otp)
                                // const response = await fast2sms.sendMessage({ authorization:"SLAea84yPOZ0fqdcvYMtlKgoFb5uQkpsrTDjmNhJ2En93I1i6UFdoPe6LkK0QiMsSm2qRbahY9yXtrGZ",message:otp,numbers:[req.body.contact]})
                                console.log("line 77",otp)
                              // const token = await jwt.sign({ userid: data._id }, 'secret')
                              const token = jwt.sign({ userid: data1._id }, 'secret')
                              console.log("line 59",data1)
                              res.status(200).send({ message: "verification otp send your email",otp,data1,token})
                                setTimeout(() => {
                                   sendOtp.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                        console.log("line 81", result)
                                        if(err){throw err}
                                    })
                                }, 30000)
                            }else{res.status(400).send('otp does not send')}  
                        }) 
                       
                        // res.status(200).send({ message: data1, token })
                    
                }
                else{
                    console.log("line 66",'please signup')
                    res.status(400).send({message:'please register your profile'})
                }  
            })
        } else {
            if(req.body.otp==null){
            console.log('line 55',req.body.contact)
            adminSchema.findOne({ contact: req.body.contact }, async (err, data) => {
                if(data){
                    if(data.contact==req.body.contact){
                        console.log("line 66",data.contact)
                        console.log("line 67",req.body.contact)
                        const otp = otpRandamString.randomString(3)
                            console.log("otp", otp)
                            sendOtp.create({otp: otp },async (err,datas) => {
                                console.log("line 72", datas)
                                if(err){throw err}
                                if (datas) {
                                console.log("line 75", datas)
                        const response = await fast2sms.sendMessage({ authorization:"7AMS5DChNOQakW4RbGtZzPy8njrvJsHXiFIUp9f6V23wqKBm0E90ZS7gEBN2pVurRXAD4cC3Jei81WKI",message:otp,numbers:[req.body.contact]})
                        res.status(200).send({ message: "verification otp send your mobile number",datas })
                                    setTimeout(() => {
                                       sendOtp.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                            console.log("line 81", result)
                                            if(err){throw err}
                                        })
                                    }, 30000)
                                }else{res.status(400).send('otp does not send')}  
                            }) 
                    }else{res.status(400).send('contact does not match')}
                }else{
                    console.log("line 66",'please signup')
                    res.status(400).send({message:'please register your profile'})
                }
                
            })
        }else{
           sendOtp.findOne({otp:req.body.otp},(err,data)=>{
               console.log("line 94",data)
                    if(data!=null){
                        adminSchema.findOne({contact:req.body.contact},async(err,datas)=>{
                            console.log("line 99",datas)
                            if(err){throw err}
                            else{
                                const token=await jwt.sign({userid:datas._id},'SECRET')
                                res.status(200).send({datas:datas,token})
                                }
                        })
                    }else{
                        res.status(400).send({message:"otp expired"})
                    }
            })        
        }
    }
    } 
    catch (err) {
        console.log(err.message)
        res.status(500).send({ message: 'please check it again' })
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


const verifyEmail = (req,res)=>{
    try{
        adminSchema.findOne({email:req.body.email},(err,data)=>{
            if(data){
                res.status(200).send({message:"exist"})
            }
            else{
                res.status(400).send({message:"new"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}



const verifyContact = (req,res)=>{
    try{
        adminSchema.findOne({contact:req.body.contact},(err,data)=>{
            if(data){
                res.status(200).send({message:"exist"})
            }
            else{
                res.status(400).send({message:"new"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


// let transport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'dhanamcse282@gmail.com',
//         pass: 'dhanam282'
//     }
// })

// let postMail = function ( to, subject, text) {
//     transport.sendMail({
//         from: 'dhanamcse282@gmail.com',
//         to: to,
//         subject: subject,
//         text: text,
//     })
// }





//


const getAllOwnersUser = (req, res) => {
    try {

        adminSchema.find({}, (err, data) => {
            console.log(data)
            if (err) {
                console.log(err)
                res.status(400).send({ message: 'no data exists' })
            } else {
                data = data.filter(result => result.deleteFlag === "false")
                console.log(data, 'inside if')
                res.status(200).send({ message: data })
            }
        })
    } catch (e) {
        res.status(500).send({ message: e })
    }
}

//
const getByOwnerUserId = (req, res) => {
    try {
        console.log('103', req.body)
        const token = jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOne({ _id: id }, (err, data) => {
            if (err) {
                console.log(err)
                console.log('107', err)
                res.status(400).send({ message: 'something error in this process' })
            } else {
                if (data.deleteFlag == 'false') {
                    console.log(data)
                    res.status(200).send({ message: data })
                } else {
                    console.log('your data does not exists')

                    res.status(400).send({ message: 'data does not exists' })
                }
            }
        })
    } catch (e) {
        res.status(500).send({ message: 'please check it again' })
    }
}


const updateOwnerUser = async (req, res) => {
    try {
        console.log('hai 108')
        console.log(req.body.name)
        const token = await jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOneAndUpdate({ _id: id }, { $set: req.body }, { returnOriginal: false }, (err, data) => {
            if (err) {
                console.log('unsucessfull')
                res.status(400).send({ message: 'unsuccessfull', data })
            } else {
                console.log(data)
                res.status(200).send({ message: 'update successfully', data })
            }
        })

    } catch (e) {
        res.status(500).send({ message: e })
    }
}


const deleteOwnerUser = (req, res) => {
    try {
        // console.log(req.body._id)
        const token = jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOneAndUpdate({ _id: id }, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
            // console.log(data)
            if (!err) {
                // console.log('delete process does not run properly')
                res.status(200).send({ message: 'deleted successfully', data })
            } else {
                // console.log('deleted successfully')
                res.status(400).send({ message: 'data does not delete properly' })
            }
        })
    } catch (e) {
        res.status(500).send({ message: e })
    }
}


function paginated(model,req,res) {
    // return () => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = (page) * limit
    const result = {}
    if (endIndex < model.length) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        result.previous = {
            // page: page - 1,
            limit: limit
        }
    }
    // console.log(result)
    result.result = model.slice(startIndex, endIndex)
    // result.result = model.find().limit(limit).skip(startIndex).exec()
    // res.send(result)
    return result
    // next()
    // }
}

 
const packagePlan =async(req,res)=>{ 
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        console.log(verify);
        const alreadyExists = await paymentController.packagePayment.aggregate([{$match:{adminId:verify}}])
        console.log(alreadyExists.length)
        if(alreadyExists.length!=0){
            console.log("inside if");
            const adminData = await adminSchema.aggregate([{$match:{_id:new mongoose.Types.ObjectId(verify)}}])
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
            req.body.status="active"
        }
        const adminUpdate = await adminSchema.findOneAndUpdate({_id:verify},req.body,{new:true})
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
    adminSchema.findOne({_id:verify},(err,data)=>{
        if(data){
            res.status(200).send({message:data})
        }
        else{
            res.status(400).send({message:"unauthorized"})
        }
        
    })
}



const updatePackagePlan = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verifyId = token.userid
    packagePlanSchema.findOneAndUpdate({adminId:verifyId},req.body,{new:true},(err,data)=>{
        if(err) throw err
        res.status(200).send({message:data})
    })
}



module.exports = {
    login,
    register,
    getAllOwnersUser,
    getByOwnerUserId,
    updateOwnerUser,
    deleteOwnerUser,
    paginated,
    packagePlan,
    updatePackagePlan,
    verifyContact,
    verifyEmail,
    getSingleAdminPackage
}