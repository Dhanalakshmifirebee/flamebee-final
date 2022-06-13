const multer=require('multer')
const fs=require('fs')

const storage=multer.diskStorage({
    // console
    destination:(req,res,cb)=>{
         var k = fs.existsSync('/home/fbnode/Dhanalakshmi/flameBeeImage');
            console.log(k);
                if(!k){
                    fs.mkdir('/home/fbnode/Dhanalakshmi/flameBeeImage',(err,path)=>{
                        if(err){
                            console.log(err)
                        }
                        else{
                            console.log(path)
                        }
                    })
                    cb(null,'/home/fbnode/Dhanalakshmi/flameBeeImage')
                }
                else{
                    cb(null,'/home/fbnode/Dhanalakshmi/flameBeeImage')
                }
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now().toString() + file.originalname)
    },
})

const fileFilters=(req,file,cb)=>{
    // console.log('inside filefilter')
    // const fileTypes=/jpeg|jpg|png|zip/;
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='image/gif'|| file.mimetype=='text/plain' || file.mimetype=='application/pdf'){
        cb(null,true)
    }else{
    cb(null,false)
    }
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}
