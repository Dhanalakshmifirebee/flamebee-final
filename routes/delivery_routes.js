
const router=require('express').Router()
const deliveryControl=require('../controller/delivery_controller')
const multer=require('../middleware/multer')
const valid=require('../model/adminSchema')

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


module.exports=router