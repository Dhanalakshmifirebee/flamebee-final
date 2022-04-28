const router=require('express').Router()
const schemaForBothSuperAndAdmin=require('../controller/adminController')
const adminRequest = require('../controller/adminRequestController')
const valid=require('../model/adminSchema')
const multer=require('../middleware/multer')


//for admin
router.post('/register',valid.validation,schemaForBothSuperAndAdmin.register)
router.post('/login',schemaForBothSuperAndAdmin.login)
router.post('/verifyContact',schemaForBothSuperAndAdmin.verifyContact)
router.get('/getAllUser',schemaForBothSuperAndAdmin.getAllOwnersUser)
router.get('/getByOwnerId',schemaForBothSuperAndAdmin.getByOwnerUserId)
router.put('/updateOneUser',schemaForBothSuperAndAdmin.updateOwnerUser)
router.delete('/deleteUser',schemaForBothSuperAndAdmin.deleteOwnerUser)

router.post('/RegisterAdmin',adminRequest.createAdminRequest)
router.get('/acceptAdmin/:id',adminRequest.acceptAdmin)
router.post('/adminLogin',adminRequest.adminLogin)

router.post('/packagePlan',schemaForBothSuperAndAdmin.packagePlan)
router.put('/updatePackagePlan',schemaForBothSuperAndAdmin.updatePackagePlan)

module.exports=router