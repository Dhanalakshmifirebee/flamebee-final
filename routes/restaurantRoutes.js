const router = require('express').Router()
const restaraunt = require('../controller/restaurantController')
const multer=require('../middleware/multer')


//Restaurant
router.post('/image',multer.upload.single('image'),restaraunt.image)
router.post('/createRestaurant',restaraunt.createRestaurant)
router.post('/createRestaurant1',restaraunt.createRestaurant1)

router.get('/getSpecificRestaurant',restaraunt.getSpecificRestaurant)
router.put('/updateRestaurant/:id',restaraunt.updateRestaurant)
router.delete('/removeRestaurant/:id',restaraunt.removeRestaurant)
router.get('/getRestaurantByLocation/:latitude/:longitude',restaraunt.getRestaurantByLocation)
router.get('/getRestaurantLocationByOffer',restaraunt.getRestaurantLocationByOffer)
router.get('/getRestaurantLocationByRating',restaraunt.getRestaurantLocationByRating)

router.get('/filterFood',restaraunt.filterFood)
router.get('/findlocation',restaraunt.findlocation)

//Food
router.post('/addFood',restaraunt.addFood)
router.get('/getFoodByOwner/:id',restaraunt.getFoodByOwner)
router.put('/updateFood/:id',restaraunt.updateFood)
router.delete('/deleteFood',restaraunt.deleteFood)
router.get('/filterFoodByPriceLowToHigh',restaraunt.filterFoodByPriceLowToHigh)
router.get('/filterFoodByPriceHighToLow',restaraunt.filterFoodByPriceHighToLow)
// router.get('/getFoodByPrice1',restaraunt.getFoodByPrice1)
// router.get('/getFoodByPrice2',restaraunt.getFoodByPrice2)
// router.get('/getFoodByPrice3',restaraunt.getFoodByPrice3)
// router.get('/getFoodByPrice4',restaraunt.getFoodByPrice4)



//Restaurant Review
router.post('/createRestaurantReview',restaraunt.createRestaurantReview)
router.get('/getRestaurantReview/:id',restaraunt.getRestaurantReview)



//Resaturant Rating
router.post('/restaurantRating',restaraunt.restaurantRating)



module.exports=router