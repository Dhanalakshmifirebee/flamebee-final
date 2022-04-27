const router = require('express').Router()
const report = require('../controller/reportController')

router.post('/createReport',report.createReport)
router.post('/getReportList',report.getReportList)

module.exports=router
