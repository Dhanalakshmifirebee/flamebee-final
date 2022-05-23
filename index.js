const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv').config()


const errorThrower = require('./errorHandler/error_thrower')
const appError = require('./errorHandler/common_error_handler')
require('./config/db_config')
const admin = require('./routes/adminRoutes')
const superAdmin=require('./routes/superAdminRoutes')
const restaraunt = require('./routes/restaurantRoutes')
const delivery=require('./routes/delivery_routes')
const order=require('./routes/order_routes')
const payment =require('./routes/paymentRoute')
const blog=require('./routes/blogRoute')
const report=require('./routes/reportRoute')
const management = require('./routes/managementRoute')


const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/uploads', express.static('/home/fbnode/Dhanalakshmi/flameBeeImage'))

app.use('/flame/admin', admin)
app.use('/flame/superAdmin', superAdmin)
app.use('/flame/restaurant', restaraunt)
app.use('/flame/delivery',delivery)
app.use('/flame/order',order)
app.use('/flame/payment',payment)
app.use('/flame/blog',blog)
app.use('/flame/report',report)
app.use('/flame/management',management)




app.get('/',(req,res)=>{
    res.send('welcome flamebee')
})

app.use((req, res, next) => {
    const error = new appError({ statusCode: 404, status: "false", message: "undefined" })
    next(error, req, res, next)
})

app.use(errorThrower)

app.listen(8613, () => {
    console.log("port running on ", 8613)
})


