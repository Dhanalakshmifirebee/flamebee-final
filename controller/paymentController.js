const paymentController = require("../model/paymentSchema")
const jwt = require('jsonwebtoken')
const razorpay = require('razorpay');
const { convertSpeed } = require("geolib");
const moment = require('moment');
const { adminSchema } = require("../model/adminSchema");
const env = require('dotenv')
const stripe = require('stripe')(process.env.STRIPE_SECRET_TEST)



const createOrderId =(req,res)=>{
    try{
        var instance = new razorpay({ key_id: 'rzp_test_g9dMQWCjray0qF', key_secret: '93A4bFLXPuLVXWGanF0ZM6n2' })
        var options = {
            amount: 1000,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
        };
        instance.orders.create(options, function(err, order) {
            console.log(order);
            res.status(200).send(order)
        });
    }
    catch(err){
        res.status(400).send({message:err})
    }
}


const createPayment = (req,res)=>{
    try{
        const token =req.headers.authorization
        if(token!==null){
            const decoded =jwt.decode(token)
            const verify = decoded.userid
            req.body.userId = verify
            paymentController.payment.create(req.body,(err,data)=>{
                if(err)throw err
                console.log(data.role);
                console.log(data)
                res.status(200).send({message:data})
            })
        }
        else{
            res.status(400).send({message:"unAuthorized"})
        }
       
    }
    catch(err){
        res.status(500).send({message:err})
    }
   
}


const onlinePayment = (req,res)=>{
    try{
        paymentController.payment.create(req.body,(err,data)=>{
            if(err) throw err
            paymentController.payment.findOneAndUpdate({_id:data._id},{$set:{role:"online"}},{new:true},(err,data)=>{
                if(err) throw err
                res.status(200).send({message:data})
            })
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const getPaymentList = (req,res)=>{
    try{
        paymentController.payment.find({status:"success"},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const updatePaymentStatus = (req,res)=>{
    try{
        paymentController.payment.findOneAndUpdate({userid:req.params.id},{$set:{status:"success"}},{new:true},(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const createPackagePlanPayment = (req,res)=>{
    console.log("data")
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    req.body.adminId = verify
    req.body.subscriptionStartDate = moment().format()
    console.log( moment().format());
        paymentController.packagePayment.create(req.body,(err,data)=>{
            if(err) throw err
            console.log(data);
            res.status(200).send({message:data})
            adminSchema.findOneAndUpdate({_id:verify},{$set:{subscriptionStartDate:data.subscriptionStartDate,subscriptionPlan:data.subscriptionPlan}},{new:true},(err,data1)=>{
                 if(err) throw err
                 console.log(data1)
            })
        })
}


const trackPayment = (req,res)=>{
    try{
        paymentController.payment.findOne({transactionId:req.params.id},(err,data)=>{
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


const payment =  async (req,res)=>{
    let { amount , id } = req.body
    try{
        const createPayment = await stripe.paymentIntents.create({
            amount,
            currency : "USD",
            description : "Spatula company",
            payment_method : id ,
            confirm : true
        })
        console.log("payment",createPayment)
        res.status(200).send({message:"Payment Successfull",success:"true"})
    }
    catch(err){
        res.status(500).send({message:"Payment failed",success :"false"})
    }
}


module.exports={
    createOrderId,
    createPayment,
    getPaymentList,
    updatePaymentStatus,
    onlinePayment,
    createPackagePlanPayment,
    trackPayment,
    payment
}