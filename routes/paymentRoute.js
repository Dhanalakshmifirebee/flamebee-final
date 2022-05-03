const router = require('express').Router()
const payment = require('../controller/paymentController')

router.post('/createOrderId',payment.createOrderId)
router.post('/createPayment',payment.createPayment)
router.get('/getPaymentList',payment.getPaymentList)
router.put('/updatePayment/:id',payment.updatePaymentStatus)

//package Payment

router.post('/createPackagePayment',payment.createPackagePlanPayment)


module.exports=router