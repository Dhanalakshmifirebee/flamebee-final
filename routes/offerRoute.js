const router = require('express').Router()
const  offer = require('../controller/offerController')

router.post('/createOffer',offer.createOffer)
router.get('/getOfferList',offer.getOfferList)
router.put('/updateOffer/:id',offer.updateOffer)
router.delete('/deleteOffer/:id',offer.deleteOffer)


module.exports=router