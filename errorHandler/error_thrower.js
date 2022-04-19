module.exports = (err,req,res,next)=>{
    res.status(err.statusCode || 400).json({
        message : err.message,
        error : err,
        stack : err.stack
    })
}