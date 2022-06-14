const router=require('express').Router()
const superAdmin=require('../controller/superAdminController')
const valid=require('../model/adminSchema')


//--------------------------------------------- SuperAdmin --------------------------------------------------

router.post('/superAdminRegister',valid.validation,superAdmin.superAdminRegistration)
router.post('/superAdminLogin',valid.validation,superAdmin.superAdminLogin)

//----------------------------------- package details ------------------------------------------------------

router.post('/createAdminPackage',superAdmin.createAdminPackage)
router.get('/getPackagePlan',superAdmin.getPackagePlan)
router.put('/updatePackage/:id',superAdmin.updatePackage)
router.delete('/removePackage/:id',superAdmin.deletePackage)

//----------------------------------------------- contact ---------------------------------------------------

router.post('/createContact',superAdmin.createContact)
router.get('/getContact',superAdmin.getContact)
router.put('/updateContact',superAdmin.updateContact)
router.delete('/deleteContact',superAdmin.deleteContact)

//---------------------------------------- add Admin,add Restaurant ---------------------------------------

router.post('/addAdmin',superAdmin.addAdmin)
router.post('/addRestaurantBySuperAdmin',superAdmin.addRestaurantBySuperAdmin)

//------------------------------------------- Terms & Condition -------------------------------------------

router.post('/createTermsAndCondition',superAdmin.createTermsAndCondition)
router.get('/getTermsAndCondition',superAdmin.getTermsAndCondition)
router.put('/updateTermsAndCondition/:id',superAdmin.updateTermsAndCondition)


//-------------------------------------------- contact Form -------------------------------------------------

router.post('/createContactForm',superAdmin.createContactForm)
router.get('/getContactFormDetails',superAdmin.getContactFormDetails)



module.exports=router