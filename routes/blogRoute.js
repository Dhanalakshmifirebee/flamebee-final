const router = require('express').Router()
const blog = require('../controller/blogController')
const multer=require('../middleware/multer')

router.post('/createBlog',blog.createBlog)
router.get('/getBlog',blog.getBlog)
router.get('/getSingleBlog/:blogId',blog.getSingleBlog)
router.put('/updateBlog/:id',blog.updateBlog)
router.delete('/deleteBlog/:id',blog.deleteBlog)

router.delete('/unsetField',blog.unsetField)

router.post('/addComment/:blogId',blog.addComment)
router.get('/getComment',blog.getComment)
router.get('/getCommentByBlogId/:blogId',blog.getCommentByBlogId)

module.exports=router
