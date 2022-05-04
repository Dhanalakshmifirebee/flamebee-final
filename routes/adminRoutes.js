const router=require('express').Router()
const schemaForBothSuperAndAdmin=require('../controller/adminController')
const adminRequest = require('../controller/adminRequestController')
const valid=require('../model/adminSchema')
const multer=require('../middleware/multer')


//for admin

router.post('/register',valid.validation,schemaForBothSuperAndAdmin.register)
router.post('/login',schemaForBothSuperAndAdmin.login)
router.post('/verifyContact',schemaForBothSuperAndAdmin.verifyContact)
router.post('/verifyEmail',schemaForBothSuperAndAdmin.verifyEmail)

router.get('/getAllUser',schemaForBothSuperAndAdmin.getAllOwnersUser)
router.get('/getByOwnerId',schemaForBothSuperAndAdmin.getByOwnerUserId)
router.put('/updateOneUser',schemaForBothSuperAndAdmin.updateOwnerUser)
router.delete('/deleteUser',schemaForBothSuperAndAdmin.deleteOwnerUser)

// router.post('/packagePlan',schemaForBothSuperAndAdmin.packagePlan)
// router.put('/updatePackagePlan',schemaForBothSuperAndAdmin.updatePackagePlan)
// router.get('/getSingleAdminPackage',schemaForBothSuperAndAdmin.getSingleAdminPackage)

router.post('/packagePlan',adminRequest.packagePlan)

router.post('/RegisterAdmin',adminRequest.createAdminRequest)
router.post('/acceptAdmin/:id',adminRequest.acceptAdmin)
router.post('/adminLogin',adminRequest.adminLogin)
router.get('/getAdminRequestList',adminRequest.getAdminRequest)
router.get('/getSingleAdminPackage',adminRequest.getSingleAdminPackage)







module.exports=router