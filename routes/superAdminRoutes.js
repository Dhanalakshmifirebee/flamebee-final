const router=require('express').Router()
const superAdmin=require('../controller/superAdminController')
const valid=require('../model/adminSchema')

router.post('/superAdminRegister',valid.validation,superAdmin.superAdminRegistration)
router.post('/superAdminLogin',valid.validation,superAdmin.superAdminLogin)

module.exports=router