const router = require('express').Router()
const payment = require('../controller/paymentController')
const cors = require('cors')


router.post('/createOrderId',payment.createOrderId)
// router.post('/createPayment',payment.createPayment)
router.get('/getPaymentList',payment.getPaymentList)
router.put('/updatePayment/:id',payment.updatePaymentStatus)

//package Payment

router.post('/createPackagePayment',payment.createPackagePlanPayment)

router.get('/trackPayment/:id',payment.trackPayment)

//------------------------------------------------------------------------------------------------------

router.post('/createPayment',cors(),payment.payment)

module.exports=router