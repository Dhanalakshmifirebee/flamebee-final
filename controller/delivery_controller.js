
const deliveryController=require('../model/delivery_schema')
const orderControll = require('../model/order_schema')
const {validationResult}=require('express-validator')
const nodemailer=require('nodemailer')
const makeId=require('../controller/random_string')
const jwt=require('jsonwebtoken')
const geolib = require('geolib')


const CreateCandidate=async(req,res)=>{
    try{
        console.log("line10",req.body)
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) {
            console.log("line13",errors)
            res.send({ message: errors.array() })
        } else {
            deliveryController.deliveryRegister.countDocuments({email:req.body.email},async(err,data)=>{
                console.log("line 17",data)
                if(data==0){
                    const unique = makeId.makeId(6)
                            console.log("line19",unique)
                            const date = Date.now().toString()
                            console.log("line21",date)
                            req.body.deliveryCandidateId = unique + date         
                            console.log(req.file) 
                            // req.body.profileImage = `http://192.168.0.112:8612/uploads/${req.file.filename}`
                        deliveryController.deliveryRegister.create(req.body,(err,data)=>{

                        const deliveryId=data.deliveryCandidateId
                        console.log("line 28",deliveryId)

                        deliveryController.deliveryRegister.find({_id:data._id},{deliveryCandidateId:0},(err,data)=>{
                            console.log("line33",data)                 
                            res.status(200).send({success:"true",message:"successfully created",data})
                        })
                        
                        
                        })
                }
                else{res.status(400).send({message:"data already exist"})}
            })
        }
}catch(err){
    console.log(err.message)
    res.status(500).send({message:err.message})}
}


const candidateLogin=(req,res)=>{
    try{
    deliveryController.deliveryRegister.findOne({email:req.body.email,deleteFlag:"false"},(err,data)=>{
        console.log("line 48",data)
        if(data){
             if(req.body.deliveryCandidateId==data.deliveryCandidateId){
               data.deliveryLocation.deliveryLatitude=req.body.deliveryLatitude
               data.deliveryLocation.deliveryLongitude=req.body.deliveryLongitude
               const token = jwt.sign({ _id: data._id }, 'secret')
                deliveryController.deliveryRegister.findOneAndUpdate({email:req.body.email},req.body,{new:true},(err,datas)=>{
                    if(err)throw err
                    console.log("line 60",datas)
                    res.status(200).send({success:"true", message: "login successfully",datas, token })
                })
                    
            }else{
                res.status(400).send({message:"invalid verifyid"})
            }
        }else{
            res.status(400).send({message:"invalid email"})
        }
    })
}catch(err){
    res.status(500).send({message:err.message})
}
}


const CandidateSelection=(req,res)=>{
    try{
            deliveryController.deliveryRegister.findById({_id:req.params.id},(err,data)=>{
            console.log("line 36",data)
            if(data){
                if(req.body.role=="reject"){
                    postMail(data.email, 'Job information','sorry you are not qualified to our job' )
                    deliveryController.deliveryRegister.findOneAndUpdate({_id:data._id},{$set:{role:"reject",deleteFlag:'true'}},{new:true},(err,data)=>{
                        if(err){throw err}
                        else{
                            console.log("line 43",data)
                            res.status(200).send({message:"your not selected",data})}
                    })        
                }else{
                    deliveryController.deliveryRegister.findOneAndUpdate({_id:req.params.id},{$set:{role:"accept",deleteFlag:"false"}},{new:true},(err,data)=>{
                        console.log('line 83',data)
                        if(data){
                        postMail(data.email, 'job information(you are selected)',data.deliveryCandidateId)  
                        res.status(200).send({message:"you are selected",data,deliveryCandidateId:data.deliveryCandidateId})
                        }else{res.status(400).send({message:"invalid",err})}
                    })
                }
            }else{
                res.status(400).send('invalid id')
            }
            
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const selectedCandidateList=(req,res)=>{
    try{
        console.log("line87",req.params.role)
        deliveryController.deliveryRegister.find({role:req.params.role,deleteFlag:'false'},(err,data)=>{
            if(err){
                res.status(400).send({message:"data not found"})
            }else{
                console.log("selected list",data)
                res.status(200).send({message:"selected candidate list",data})
            }
        })
       
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


let transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhanamcse282@gmail.com',
        pass: 'dhanam282'
    }
})


const postMail = function ( to, subject, text) {
    return transport.sendMail({
        from: 'dhanamcse282@gmail.com',
        to: to,
        subject: subject,
        text: text,
    })
}


const getAllCandidate=(req,res)=>{
    try{
    deliveryController.deliveryRegister.find({deleteFlag:'false',role:"candidate"},(err,data)=>{
        if(err){
            res.status(400).send({message:"Something else"})
        }else{
        res.status(200).send({message:"All Details",data})
        }
    })
}catch(err){
    res.status(500).send({message:err.message})
}
}


const getCandidateDetails=(req,res)=>{
    try{
        console.log(req.body)
        deliveryController.deliveryRegister.findById({_id:req.params.id,deleteFlag:'false'},(err,data)=>{
            if(err){
                res.status(400).send({message:"Invalid Id"})
            }else{
            res.status(200).send({message:"your details",data})}
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const updateCandidateProfile=(req,res)=>{
    try{
        deliveryController.deliveryRegister.findById(req.params.id,{deleteFlag:'false'},(err,data)=>{
            if(err)throw err
            deliveryController.deliveryRegister.findOneAndUpdate(req.params.id,req.body,{new:true},(err,data)=>{
                if(err){
                    res.status(400).send({message:"Invalid Id"})
                }else{
                    res.status(200).send({message:" successfully updated profile details",data})
                }
            })
        })

    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const deleteCandidateProfile=(req,res)=>{
    try{
        deliveryController.deliveryRegister.findByIdAndUpdate(req.params.id,{deleteFlag:'true'},{returnOriginal:false},(err,data)=>{
            if(err){
                res.status(400).send({message:"doesn't deleted data"})
            }else{
                res.status(200).send({message:"deleted data details",data})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const notification=(req,res)=>{
    var notification={
        'title':'Title Of notification',
        'text':'hii'
    }
    var fcm_tokens=[]
    var notification_body={
        'notification':notification,
        'registration_ids':fcm_tokens
    }
    fetch('https://fcm.googleapis.com/fcm/send',{
        'method':'POST',
        'headers':{
            'Authorization':'key='+'AAAAZzfSLEc:APA91bFm1OU3lzg-LLaIEOoEPqY3l-UUMgWCxmsDIj1261wPqr5NxifSD4kR19sAJu-LWhOdXgb9ayd5S1SvzcO7JLOpui0NkQkkYz0g9kotvkfPy6CG7KJ0SvlajSmbP652Iq0MsJ10','content-Type':'application/json'
        },
        'body':JSON.stringify(notification_body)
    }).then(()=>{
        res.status(200).send('notification send successfully')
    }).catch(()=>{
        res.status(500).send('something went wrong')
    })
}


const foodDelivery =(req,res)=>{
    try{
        deliveryController.deliveryRegister.find({},(err,data)=>{
            console.log(data)
            const datas=data.filter(((result)=>filterLocation(result,5000,req.params.latitude,req.params.longitude)))
            res.status(200).send({message:"nearBy Delivery Candidate Details",datas})
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
    
    
}


function filterLocation(result,radius,latitude,longitude)
    {
      if (!result.deliveryCandidateLocation){ 
        return false;
      }
      console.log('line 21',result.deliveryCandidateLocation.deliveryCandidateLatitude);
      console.log('line 22',result.deliveryCandidateLocation.deliveryCandidateLongitude);
      var x = geolib.isPointWithinRadius(
        {
          latitude: result.deliveryCandidateLocation.deliveryCandidateLatitude,
          longitude: result.deliveryCandidateLocation.deliveryCandidateLongitude
        },
        { 
          latitude,longitude
        }, 
           radius
      );

      console.log('x',x)
      if (x === true) {
        console.log('line 35',result)
        return result;
      }
    
}



module.exports={
    CreateCandidate,
    getAllCandidate,
    getCandidateDetails,
    updateCandidateProfile,
    deleteCandidateProfile,
    CandidateSelection,
    selectedCandidateList,
    notification,
    candidateLogin,
    foodDelivery
}