const multer=require('multer')
const fs=require('fs')

const storage=multer.diskStorage({
    // console
    destination:(req,res,cb)=>{
         var k = fs.existsSync('/home/fbnode/uploads/flamebee1');
            console.log(k);
                if(!k)
                 fs.mkdir('/home/fbnode/uploads/flamebee1',(err,path)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(path)
                }
                })
                cb(null,'/home/fbnode/uploads/flamebee1')

        cb(null,'/home/fbnode/uploads/flamebee1')
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now().toString() + file.originalname)
    },

})

const fileFilters=(req,file,cb)=>{
    // console.log('inside filefilter')
    // const fileTypes=/jpeg|jpg|png|zip/;
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='image/gif'){
        cb(null,true)
    }else{
    cb(null,false)
    }
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}
