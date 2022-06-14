const reportController = require('../model/reportSchema')


const createReport =(req,res)=>{
    try{
        reportController.report.create(req.body,(err,data)=>{
            if(err) {
                throw err
            }
            else{
                console.log(data)
                res.status(200).send({message:data})
            }
        })
    }
    catch(err){
         res.status(500).send({message:err.message})
    }
}


const getReportList = (req,res)=>{
    try{
        reportController.report.find({},(err,data)=>{
            if(err) {
                throw err
            }
            else{
                if(data.length!=0){
                    console.log(data)
                    res.status(200).send({message:data})
                }
                else{
                    res.status(400).send({messsage:"data not found"})
                }
            }
           
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}



module.exports={
    createReport,
    getReportList
}