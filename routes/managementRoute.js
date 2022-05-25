const router = require('express').Router()
const management = require('../controller/managementController')


/////////// Content

router.post('/createContent',management.createContent)
router.get('/getContentList',management.getContentList)
router.put('/updateContent/:id',management.updateContent)
router.delete('/deleteContent/:id',management.deleteContent)


//////////// FAQ

router.post('/createFAQ',management.createFAQ)
router.get('/getFAQ',management.getFAQ)
router.put('/updateFAQ/:id',management.updateFAQ)
router.delete('/deleteFAQ/:id',management.deleteFAQ)


//////////// Subscriber

router.post('/addSubscriber',management.addSubscriber)
router.get('/getSubscriberList',management.getSubscriberList)
router.put('/updateSubscriber',management.updateContent)
router.delete('/deleteSubscriber',management.deleteContent)

module.exports=router


