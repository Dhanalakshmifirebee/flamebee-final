const router = require('express').Router()
const restaraunt = require('../controller/restaurantController')
const rating = require('../controller/ratingController')
const multer=require('../middleware/multer')


//Restaurant
router.post('/image',multer.upload.single('image'),restaraunt.image)

router.post('/getLatLongByLocation',restaraunt.getLatLongByLocation)

router.post('/createRestaurant',restaraunt.createRestaurant)
router.post('/updateRestaurantWithFood/:id',restaraunt.updateRestaurantWithFood)

router.get('/getOneRestaurantById/:id',restaraunt.getOneRestaurantById)
router.get('/getSpecificRestaurant',restaraunt.getSpecificRestaurant)
router.get('/getAllRestaurant',restaraunt.getAllRestaurant)
router.put('/updateRestaurant/:id',restaraunt.updateRestaurant)
router.delete('/removeRestaurant/:id',restaraunt.removeRestaurant)
router.get('/getRestaurantByLocation',restaraunt.getRestaurantByLocation)
router.get('/getRestaurantLocationByOffer',restaraunt.getRestaurantLocationByOffer)
router.get('/getRestaurantLocationByRating',restaraunt.getRestaurantLocationByRating)
router.get('/getRestaurantLocationByRating1',restaraunt.getRestaurantLocationByRating1)

router.post('/filterFood',restaraunt.filterFood)

router.get('/searchAPI/:key',restaraunt.searchAPI)


//Food
router.post('/addFood/:restaurantId',restaraunt.addFood)
router.get('/getFoodByOwner',restaraunt.getFoodByOwner)
router.get('/getAllFood',restaraunt.getAllFood)
router.put('/updateMenu/:id',restaraunt.updateMenu)
router.delete('/deleteMenu/:id',restaraunt.deleteMenu)
router.put('/updateFood/:restaurantId/:foodId',restaraunt.updateFood)
router.delete('/deleteFood/:restaurantId/:foodId',restaraunt.deleteFood)
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
router.get('/getAllWishList',rating.getAllWishList)






module.exports=router