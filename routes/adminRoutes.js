const router=require('express').Router()
const adminRequest = require('../controller/adminRequestController')
const valid=require('../model/adminSchema')
const multer=require('../middleware/multer')


////////////// admin request

router.post('/RegisterAdmin',valid.validation,adminRequest.createAdminRequest)
router.post('/acceptAdmin/:id',adminRequest.adminSelection)
router.post('/adminLogin',adminRequest.adminLogin)
router.get('/getAdminRequestList',adminRequest.getAdminRequest)
router.get('/getSingleAdminPackage',adminRequest.getSingleAdminPackage)
router.post('/packagePlan',adminRequest.packagePlan)


///////////// command

router.post('/createCommand',adminRequest.createCommand)
router.get('/getCommandList',adminRequest.getCommandList)



module.exports=router