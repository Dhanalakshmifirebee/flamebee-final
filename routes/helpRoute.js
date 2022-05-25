const router = require('express').Router()
const help = require('../controller/helpController')

router.post('/createTopic',help.createTopic)
router.get('/getTopicList',help.getTopicList)
router.put('/updateTopic/:id',help.updateTopic)
router.delete('/deleteTopic/:id',help.deleteTopic)

///////////// Article 

router.post('/createArticle',help.createArticle)
router.get('/getArticle',help.getArticle)


module.exports= router