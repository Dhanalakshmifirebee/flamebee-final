const router=require('express').Router()
const superAdmin=require('../controller/superAdminController')
const valid=require('../model/adminSchema')

router.post('/superAdminRegister',valid.validation,superAdmin.superAdminRegistration)
router.post('/superAdminLogin',valid.validation,superAdmin.superAdminLogin)

router.post('/createAdminPackage',superAdmin.createAdminPackage)
router.get('/getPackagePlan',superAdmin.getPackagePlan)
router.put('/updatePackage/:id',superAdmin.updatePackage)
router.delete('/removePackage/:id',superAdmin.deletePackage)


router.post('/createContact',superAdmin.createContact)
router.get('/getContact',superAdmin.getContact)
router.put('/updateContact',superAdmin.updateContact)
router.delete('/deleteContact',superAdmin.deleteContact)

router.post('/addAdmin',superAdmin.addAdmin)
router.post('/addRestaurantBySuperAdmin',superAdmin.addRestaurantBySuperAdmin)

router.post('/createTermsAndCondition',superAdmin.createTermsAndCondition)
router.get('/getTermsAndCondition',superAdmin.getTermsAndCondition)
router.put('/updateTermsAndCondition/:id',superAdmin.updateTermsAndCondition)


module.exports=router