const router = require('express').Router()
const restaraunt = require('../controller/restaurantController')
const multer=require('../middleware/multer')


//Restaurant
router.post('/image',multer.upload.single('image'),restaraunt.image)
router.post('/createRestaurant',restaraunt.createRestaurant)
router.get('/getSpecificRestaurant',restaraunt.getSpecificRestaurant)
router.put('/updateRestaurant/:id',restaraunt.updateRestaurant)
router.delete('/removeRestaurant/:id',restaraunt.removeRestaurant)


//Food
router.post('/addFood',restaraunt.addFood)
router.get('/getFoodByOwner/:id',restaraunt.getFoodByOwner)
router.put('/updateFood/:id',restaraunt.updateFood)
router.delete('/deleteFood',restaraunt.deleteFood)
router.get('/filterFoodByPriceLowToHigh',restaraunt.filterFoodByPriceLowToHigh)
router.get('/filterFoodByPriceHighToLow',restaraunt.filterFoodByPriceHighToLow)
router.get('/getFoodByPrice',restaraunt.getFoodByPrice)



//Restaurant Review
router.post('/createRestaurantReview',restaraunt.createRestaurantReview)
router.get('/getRestaurantReview/:id',restaraunt.getRestaurantReview)



//Resaturant Rating
router.post('/restaurantRating',restaraunt.restaurantRating)



module.exports=router