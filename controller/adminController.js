const { adminSchema,sendOtp} = require('../model/adminSchema')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const fast2sms=require('fast-two-sms')
const otpRandamString=require('../controller/random_string')


const register = async (req, res) => {
    try {
        const errors = await validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).send({ message: errors.array() })
        }else {
            adminSchema.countDocuments({ email: req.body.email }, async (err, data) => {
                if (data == 0){
                    const confirmPassword=req.body.confirmPassword
                   if(req.body.password==confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.password, 10)
                    adminSchema.create(req.body, (err, result) => {
                        if (result) {
                            res.status(200).send({success:"true",message: 'Add admin successfully', data:result })
                        } else {
                            res.staus(400).send({success:"false",message: 'fail to create data' })
                        }
                    })
                   }else{
                       res.status(400).send({success:"false",message:"password & confirm password does not match"})
                   }
                   
                } else {
                    res.status(400).send({ success:"false",message: 'email is already exists' })
                }
            })
        }
    } catch (e) {
        res.status(500).send({ message: 'internal server error' })
    }

}

const login = async(req, res) => {
    try {
        if (!req.body.contact) {
            console.log('line 43',req.body.email)
            console.log('line 44',req.body.password)
            adminSchema.findOne({ email: req.body.email}, async (err, data) => {
                if(data){
                    const verifyPassword = await bcrypt.compare(req.body.password,data.password)
                    if (verifyPassword == true) {
                        const token = jwt.sign({ userid: data._id }, 'secret')
                        console.log("line 59",data)
                        res.status(200).send({ message: data, token })
                    } else {
                        res.status(400).send({ message:'invalid password' })
                    }
                }
                else{
                    console.log("line 66",'please signup')
                   res.status(400).send({message:'please register your profile'})
                }  
            })
        } else {
            if(req.body.otp==null){
            console.log('line 55',req.body.contact)
            adminSchema.findOne({ contact: req.body.contact }, async (err, data) => {
                if(data){
                    if(data.contact==req.body.contact){
                        console.log("line 66",data.contact)
                        console.log("line 67",req.body.contact)
                        const otp = otpRandamString.randomString(3)
                            console.log("otp", otp)
                            sendOtp.create({otp: otp },async (err,datas) => {
                                console.log("line 72", datas)
                                if(err){throw err}
                                if (datas) {
                                console.log("line 75", datas)
                        const response = await fast2sms.sendMessage({ authorization: process.env.OTPKEY,message:otp,numbers:[req.body.contact]})
                        console.log("line 77",response,otp)
                       // const token = await jwt.sign({ userid: data._id }, 'secret')
                    
                        res.status(200).send({ message: "verification otp send your mobile number",response,otp,data })
                                    setTimeout(() => {
                                       sendOtp.findOneAndDelete({ otp: otp },{returnOriginal:false}, (err, result) => {
                                            console.log("line 81", result)
                                            if(err){throw err}
                                        })
                                    }, 30000)
                                }else{res.status(400).send('otp does not send')}  
                            }) 
                    }else{res.status(400).send('contact does not match')}
                }else{
                    console.log("line 66",'please signup')
                    res.status(400).send({message:'please register your profile'})
                }
                
            })
        }else{
           sendOtp.findOne({otp:req.body.otp},(err,data)=>{
               console.log("line 94",data)
                    if(data!=null){
                        adminSchema.findOne({contact:req.body.contact},async(err,datas)=>{
                            console.log("line 99",datas)
                            if(err){throw err}
                            else{
                                const token=await jwt.sign({userid:datas._id},'SECRET')
                                res.status(200).send({datas:datas,token})
                                }
                        })
                    }else{
                        res.status(400).send({message:"otp expired"})
                    }
            })        
        }
    }
    } 
    catch (err) {
        console.log(err.message)
        res.status(500).send({ message: 'please check it again' })
    }
}

//
const getAllOwnersUser = (req, res) => {
    try {

        adminSchema.find({}, (err, data) => {
            console.log(data)
            if (err) {
                console.log(err)
                res.status(400).send({ message: 'no data exists' })
            } else {
                data = data.filter(result => result.deleteFlag === "false")
                console.log(data, 'inside if')
                res.status(200).send({ message: data })
            }
        })
    } catch (e) {
        res.status(500).send({ message: e })
    }
}

//
const getByOwnerUserId = (req, res) => {
    try {
        console.log('103', req.body)
        const token = jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOne({ _id: id }, (err, data) => {
            if (err) {
                console.log(err)
                console.log('107', err)
                res.status(400).send({ message: 'something error in this process' })
            } else {
                if (data.deleteFlag == 'false') {
                    console.log(data)
                    res.status(200).send({ message: data })
                } else {
                    console.log('your data does not exists')

                    res.status(400).send({ message: 'data does not exists' })
                }
            }
        })
    } catch (e) {
        res.status(500).send({ message: 'please check it again' })
    }
}

const updateOwnerUser = async (req, res) => {
    try {
        console.log('hai 108')
        console.log(req.body.name)
        const token = await jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOneAndUpdate({ _id: id }, { $set: req.body }, { returnOriginal: false }, (err, data) => {
            if (err) {
                console.log('unsucessfull')
                res.status(400).send({ message: 'unsuccessfull', data })
            } else {
                console.log(data)
                res.status(200).send({ message: 'update successfully', data })
            }
        })

    } catch (e) {
        res.status(500).send({ message: e })
    }
}

const deleteOwnerUser = (req, res) => {
    try {
        // console.log(req.body._id)
        const token = jwt.decode(req.headers.authorization)
        const id = token.userid
        adminSchema.findOneAndUpdate({ _id: id }, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
            // console.log(data)
            if (!err) {
                // console.log('delete process does not run properly')
                res.status(200).send({ message: 'deleted successfully', data })
            } else {
                // console.log('deleted successfully')
                res.status(400).send({ message: 'data does not delete properly' })
            }
        })
    } catch (e) {
        res.status(500).send({ message: e })
    }
}

function paginated(model,req,res) {
    // return () => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = (page) * limit
    const result = {}
    if (endIndex < model.length) {
        result.next = {
            page: page + 1,
            limit: limit
        }
    }
    if (startIndex > 0) {
        result.previous = {
            // page: page - 1,
            limit: limit
        }
    }
    // console.log(result)
    result.result = model.slice(startIndex, endIndex)
    // result.result = model.find().limit(limit).skip(startIndex).exec()
    // res.send(result)
    return result
    // next()
    // }
}

module.exports = {
    login,
    register,
    getAllOwnersUser,
    getByOwnerUserId,
    updateOwnerUser,
    deleteOwnerUser,
    paginated
}