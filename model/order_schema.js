const mongoose = require('mongoose');

const restrauntSchema = mongoose.Schema({
  restarauntName: String,
  address: String,
  contact: String,
  cuisine: String,
  rating: Number,
  typeOfFood: String,
  // restarauntImage: String,
  // menuImage: String,
  userId: String,
  email: String,
  popularDishes: String,
  averageCost: String,
  restaurantlocation:{
    restaurantLatitude:Number,
    restaurantLongitude:Number
  },
  deleteFlag: {
      type: String,
      default: 'false'
  }
})

const avaliableFoodSchema = mongoose.Schema({
  //foodImage: String,
  foodId:String,
  price: Number,
  offer: String,
  typeOfFood: String,
  foodName: String,
  rating:Number,
  restaurantDetails:[restrauntSchema],
  tax: String,
  count:Number,
  amount: {
      type: Number,
      default: 1
  },
  deleteFlag: {
      type: String,
      default: 'false'
  }
})


const ordersSchema = mongoose.Schema({
  orderId:String,
  name:String,
  contact:Number,
  email:String,
  address:String,
  deliveryCandidateName:String,
  candidateContactNumber:Number,
  deliveryLocation:{
    type:Object,
    deliveryLatitude:Number,
    deliveryLongitude:Number
  },
  userId:String,
  orderStatus:{
    type:String,
    default:"orderPending"
  },
  deleteFlag:{
    type:String,
    default:false
  },
  userLocation:{
    type:Object,
    userLatitude:Number,
    userLongitude:Number
  },
  total:Number,
  role:{
      type:String,
      default:"cash"
  },
  foodSchema:[avaliableFoodSchema],
 
})



const order=mongoose.model('ordersSchema', ordersSchema)

module.exports={order}
