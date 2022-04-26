const router=require('express').Router()
const superAdmin=require('../controller/superAdminController')
const valid=require('../model/adminSchema')

router.post('/superAdminRegister',valid.validation,superAdmin.superAdminRegistration)
router.post('/superAdminLogin',valid.validation,superAdmin.superAdminLogin)

router.post('/createAdminPackage',superAdmin.createAdminPackage)
router.get('/getPackagePlan',superAdmin.getPackagePlan)

module.exports=router