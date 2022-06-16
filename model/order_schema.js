const mongoose = require('mongoose');
const { stringify } = require('querystring');


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


const orderSchema = mongoose.Schema({
  name:String,
  email:String,
  phoneNo:Number,
  address:String,
  area:String,
  city:String,
  state:String,
  userAddress:String,
  userLocation:{
    userLatitude:Number,
    userLongitude:Number
  },
  paymentType:String,
  paymentDetails:Object,
  cart:[Object],
  deliveryDate:String,
  deliveryTime:String,
  deliveryType:String,
  total:String,
  date:String,
  status:{
    type:String,
    default:"pending"
  }
})


const cancellationReasonSchema = mongoose.Schema({
     reason:String,
     cancellationFor:String,
     status:String
})


// const ordersSchema = mongoose.Schema({

//   orderId:String,
//   name:String,
//   contact:Number,
//   email:String,
//   address:String,
//   area :String,
//   deliveryCandidateName:String,
//   candidateContactNumber:Number,
//   deliveryLocation:{
//     type:Object,
//     deliveryLatitude:Number,
//     deliveryLongitude:Number
//   },
//   userId:String,
//   orderStatus:{
//     type:String,
//     default:"orderPending"
//   },
//   deleteFlag:{
//     type:String,
//     default:false
//   },
//   userLocation:{
//     userLatitude:Number,
//     userLongitude:Number
//   },
//   total:Number,
//   role:{
//       type:String,
//       default:"cash"
//   },
//   foodSchema:[avaliableFoodSchema],
 
// })


const foodOrderSchema = mongoose.Schema({
     restaurantId:String,
     name:String,
     email:String,
     phoneNo:Number,
     userId:String,
     fullAddress:String,
     city:String,
     postalCode:Number,
     paymentMethod:String,
     date:String,
     time:String,
     type:String,
     foodList:[Object],
     totalPrice:Number
})


const order=mongoose.model('ordersSchema', orderSchema)
const cancellationReason = mongoose.model("cancellationReasonSchema",cancellationReasonSchema)



const foodOrder = mongoose.model("foodOrderSchema",foodOrderSchema)



module.exports={
  order,
  cancellationReason,
  foodOrder
}
