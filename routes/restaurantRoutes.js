const router = require('express').Router()
const restaraunt = require('../controller/restaurantController')
const rating = require('../controller/ratingController')
const multer=require('../middleware/multer')


//Restaurant
router.post('/image',multer.upload.single('image'),restaraunt.image)
router.post('/getLatLongByLocation',restaraunt.getLatLongByLocation)

router.post('/createRestaurant',restaraunt.createRestaurant)
router.post('/updateRestaurantWithFood/:id',restaraunt.updateRestaurantWithFood)


router.get('/getOneRestaurant/:id',restaraunt.getOneRestaurant)
router.get('/getSpecificRestaurant',restaraunt.getSpecificRestaurant)
router.put('/updateRestaurant/:id',restaraunt.updateRestaurant)
router.delete('/removeRestaurant/:id',restaraunt.removeRestaurant)
router.get('/getRestaurantByLocation/:latitude/:longitude',restaraunt.getRestaurantByLocation)
router.get('/getRestaurantLocationByOffer',restaraunt.getRestaurantLocationByOffer)
router.get('/getRestaurantLocationByRating',restaraunt.getRestaurantLocationByRating)
router.get('/getRestaurantLocationByRating1',restaraunt.getRestaurantLocationByRating1)

router.post('/filterFood',restaraunt.filterFood)

router.get('/findlocation',restaraunt.findlocation)
router.get('/searchAPI/:key',restaraunt.searchAPI)


//Food
router.post('/addFood',restaraunt.addFood)
router.get('/getFoodByOwner/:restaurantId',restaraunt.getFoodByOwner)
router.put('/updateFood/:foodId',restaraunt.updateFood)
router.delete('/deleteFood/:foodId',restaraunt.deleteFood)
router.get('/filterFoodByPriceLowToHigh',restaraunt.filterFoodByPriceLowToHigh)
router.get('/filterFoodByPriceHighToLow',restaraunt.filterFoodByPriceHighToLow)
router.get('/getCategoryList',restaraunt.getCategoryList)





//Restaurant Review
router.post('/createRestaurantReview',restaraunt.createRestaurantReview)
router.get('/getRestaurantReview/:id',restaraunt.getRestaurantReview)



//Resaturant Rating
router.post('/restaurantRating',restaraunt.restaurantRating)



router.post('/foodQualityRating',rating.foodQualityRating)
router.post('/locationRating',rating.locationRating)
router.post('/priceRating',rating.priceRating)
router.post('/serviceRating',rating.serviceRating)
router.post('/ratingForRestaurant',rating.ratingForRestaurant)
router.post('/createInterestedPersons/:restaurantId',rating.createInterestedPersons)
router.get('/UserFavoriteList',rating.UserFavoriteList)






module.exports=router