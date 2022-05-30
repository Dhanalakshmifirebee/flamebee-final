const router=require('express').Router()
const deliveryControl=require('../controller/delivery_controller')
const multer=require('../middleware/multer')
const valid=require('../model/adminSchema')
const delivery = require('../controller/deliveryCandidate')


//Register
router.post('/Register',valid.validation,deliveryControl.CreateCandidate)
router.post('/login',deliveryControl.candidateLogin)
router.get('/getAllCandidateDetails/:role',deliveryControl.getAllCandidate)
router.get('/getSingleCandidateDetails/:id',deliveryControl.getCandidateDetails)
router.put('/updateCandidateProfile/:id',deliveryControl.updateCandidateProfile)
router.delete('/deleteCandidateProfile/:id',deliveryControl.deleteCandidateProfile)

//selectionCandidate
router.post('/candidateSelection/:id',deliveryControl.CandidateSelection)
router.get('/selectedCandidateList/:role',deliveryControl.selectedCandidateList)
router.post('/notification',deliveryControl.notification)

router.get('/foodDelivery/:latitude/:longitude',deliveryControl.foodDelivery)



// ---------------------------------------------------------------------------------------------------------

router.post('/deliveryRegister',delivery.deliveryRegister)
router.post('/deliveryLogin',delivery.deliveryLogin)
router.get('/getDeliveryCandidateList',delivery.getDeliveryCandidateList)
router.post('/deliveryCandidateSelection/:id',delivery.deliveryCandidateSelection)
router.get('/getApprovedCandidateList',delivery.getApprovedCandidateList)
router.get('/getRejectedCandidateList',delivery.getRejectedCandidateList)

router.get('/acceptOrderByDeliveryCandidate/:id',delivery.acceptOrderByDeliveryCandidate)
router.get('/acceptanceOrderCount',delivery.acceptanceOrderCount)







module.exports=router