const paymentController = require("../model/paymentSchema")
const razorpay = require('razorpay')


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
    paymentController.payment.create(req.body,(err,data)=>{
        if(err)throw err
        console.log(data.role);
        console.log(data)
        res.status(200).send({message:data})
    })
}

const onlinePayment = (req,res)=>{
    paymentController.payment.create(req.body,(err,data)=>{
        if(err) throw err
        paymentController.payment.findOneAndUpdate({_id:data._id},{$set:{role:"online"}},{new:true},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    })
}


const getPaymentList = (req,res)=>{
    paymentController.payment.find({status:"success"},(err,data)=>{
        if(err) throw err
        res.status(200).send({message:data})
    })
}


const updatePaymentStatus = (req,res)=>{
    paymentController.payment.findOneAndUpdate({userid:req.params.id},{$set:{status:"success"}},{new:true},(err,data)=>{
        if(err) throw err
        console.log(data)
        res.status(200).send({message:data})

    })
}


module.exports={
    createOrderId,createPayment,getPaymentList,updatePaymentStatus,onlinePayment
}