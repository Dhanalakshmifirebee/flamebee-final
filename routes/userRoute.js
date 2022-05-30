const router = require('express').Router()
const usercontroller = require('../controller/userController')
const valid=require('../model/adminSchema')
const multer=require('../middleware/multer')


router.post('/register',valid.validation,usercontroller.register)
router.post('/login',usercontroller.logiForuser)
router.post('/verifyOtp',usercontroller.verifyOtp)
router.post('/verifyContact',usercontroller.verifyContact)
router.post('/verifyEmail',usercontroller.verifyEmail)
router.get('/getAllUser',usercontroller.getAllOwnersUser)
router.get('/getByOwnerId',usercontroller.getByOwnerUserId)
router.put('/updateOneUser',usercontroller.updateOwnerUser)
router.delete('/deleteUser',usercontroller.deleteOwnerUser)


module.exports=router