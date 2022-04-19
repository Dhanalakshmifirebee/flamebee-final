const mongoose = require('mongoose')

const dbUrl = require('../config/url_config')



mongoose.connect(dbUrl.url,()=>{
    console.log('database connected')
})    
