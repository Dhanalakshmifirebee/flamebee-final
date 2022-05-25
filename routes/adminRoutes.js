const router=require('express').Router()
const adminController=require('../controller/adminController')
const adminRequest = require('../controller/adminRequestController')
const valid=require('../model/adminSchema')
const multer=require('../middleware/multer')


//for admin

router.post('/register',valid.validation,adminController.register)
router.post('/login',adminController.login)
router.post('/verifyOtp',adminController.verifyOtp)
router.post('/verifyContact',adminController.verifyContact)
router.post('/verifyEmail',adminController.verifyEmail)

router.get('/getAllUser',adminController.getAllOwnersUser)
router.get('/getByOwnerId',adminController.getByOwnerUserId)
router.put('/updateOneUser',adminController.updateOwnerUser)
router.delete('/deleteUser',adminController.deleteOwnerUser)

// router.post('/packagePlan',schemaForBothSuperAndAdmin.packagePlan)
// router.put('/updatePackagePlan',schemaForBothSuperAndAdmin.updatePackagePlan)
// router.get('/getSingleAdminPackage',schemaForBothSuperAndAdmin.getSingleAdminPackage)

router.post('/packagePlan',adminRequest.packagePlan)

////////////// admin request

router.post('/RegisterAdmin',adminRequest.createAdminRequest)
router.post('/acceptAdmin/:id',adminRequest.adminSelection)
router.post('/adminLogin',adminRequest.adminLogin)
router.get('/getAdminRequestList',adminRequest.getAdminRequest)
router.get('/getSingleAdminPackage',adminRequest.getSingleAdminPackage)

///////////// command

router.post('/createCommand',adminController.createCommand)
router.get('/getCommandList',adminController.getCommandList)



module.exports=router