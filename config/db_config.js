const mongoose = require('mongoose')

const dbUrl = require('../config/url_config')


mongoose.connect(dbUrl.url,(err)=>{
    if(err){
        console.log("db not connected")
    }
    else{
        console.log('database connected')
    }
})    
