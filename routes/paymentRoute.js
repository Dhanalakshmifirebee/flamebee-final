const router = require('express').Router()
const payment = require('../controller/paymentController')


router.post('/createPayment',payment.createPayment)
router.get('/getPaymentList',payment.getPaymentList)
router.put('/updatePayment/;id',payment.updatePaymentStatus)

module.exports=router