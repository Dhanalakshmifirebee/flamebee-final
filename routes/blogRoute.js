const router = require('express').Router()
const blog = require('../controller/blogController')

router.post('/createBlog',blog.createBlog)
router.get('/getBlog',blog.getBlog)
router.put('/updateBlog/:id',blog.updateBlog)
router.delete('/deleteBlog/:id',blog.deleteBlog)

router.delete('/unsetField',blog.unsetField)

module.exports=router
