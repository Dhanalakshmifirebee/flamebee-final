const reportController = require('../model/reportSchema')


const createReport =(req,res)=>{
    reportController.report.create(req.body,(err,data)=>{
        if(err) throw err
        console.log(data)
        res.status(200).send({message:data})
    })
}

const getReportList = (req,res)=>{
    reportController.report.find({},(err,data)=>{
        if(err) throw err
        console.log(data)
        res.status(200).send({message:data})
    })
}



module.exports={
    createReport,getReportList
}