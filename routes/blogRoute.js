const router = require('express').Router()
const blog = require('../controller/blogController')

router.post('/createBlog',blog.createBlog)
router.get('/getBlog',blog.getBlog)

module.exports=router
