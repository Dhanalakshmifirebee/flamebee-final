const paymentController = require("../model/paymentSchema")


const createPayment = (req,res)=>{
    paymentController.payment.create(req.body,(err,data)=>{
        if(err)throw err
        console.log(data.role);
        console.log(data)
        res.status(200).send({message:data})
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
    createPayment,getPaymentList,updatePaymentStatus
}