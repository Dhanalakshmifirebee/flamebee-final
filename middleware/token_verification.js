const jwt = require('jsonwebtoken')

module.exports =(req,res,next)=>{
   
        try{
            var token = (req.headers.authorization)
            const userDatas = jwt.verify(token,process.env.SECRET_KEY)
        next()
        }catch(err){
            res.send({message:err})
} 
}