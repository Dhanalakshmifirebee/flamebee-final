const router=require('express').Router()

const orderControllDetails=require('../controller/order_controller')

router.post('/createOrderDetails',orderControllDetails.orderDetails)
router.get('/getAllOrderDetails',orderControllDetails.getAllOrderDetails)
router.get('/getSingleOrderDetails/:id',orderControllDetails.getSingleOrderDetails)

router.put('/adminUpdateOrderDetails',orderControllDetails.adminUpdateOrderDetails)
router.get('/getAllOrderAcceptedDetails',orderControllDetails.getAllOrderAcceptedDetails)

router.put('/deliveryCandidateUpdateStatusDetails',orderControllDetails.deliveryCandidateUpdateStatusDetails)
router.put('/deliveryCandidateUpdateOrderDetails',orderControllDetails.deliveryCandidateUpdateOrderDetails)


router.get('/popularFood',orderControllDetails.popularFood)
router.get('/getSingleDeliveryCandidate/:id',orderControllDetails.getSingleDeliveryCandidate)
router.put('/orderStatusUpdate/:id',orderControllDetails.orderStatusUpdate)

router.post('/cancellationReason',orderControllDetails.cancellationReason)
router.get('/getCancellationList',orderControllDetails.getCancellationList)



router.get('/getTodayOrderList',orderControllDetails.getTodayOrderList)
router.get('/getTotalRevenue',orderControllDetails.getTotalRevenue)
router.get('/getTodayRevenue',orderControllDetails.getTodayRevenue)


module.exports=router