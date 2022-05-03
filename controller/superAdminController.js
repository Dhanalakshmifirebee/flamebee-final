const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const superControll=require('../model/superAdminSchema')
const adminPackageController = require('../model/adminSchema')



const superAdminRegistration =(req, res) => {
    console.log('line 7',req.body)
    try {
        console.log('line 9',req.body)
        const errors = validationResult(req.body)
        if (!errors.isEmpty()) res.send({ message: errors.array() })
        else { 
            superControll.register.countDocuments({ email: req.body.email }, async (err, num) => {
                console.log(num)
                if (num == 0) {
                    req.body.password = await bcrypt.hashSync(req.body.password, 10)
                    superControll.register.create(req.body, (err, data) => {
                        if(err)throw err
                        res.status(200).send({message:"register successfully",data })
                    })
                }else { res.send({ message: 'Data already exists'}) }
            })
        }
    } catch (err) {
        res.status(500).send({message:err.message})
    }
}

const superAdminLogin = (req, res) => {
    try {
        superControll.register.findOne({ email: req.body.email }, async (err, data) => {
            console.log(data)
            if (data) {
                const password = await bcrypt.compare(req.body.password, data.password)
                // console.log(password)
                if (password === true) {
                    const token = jwt.sign({ _id: data._id }, 'secret')
                    res.status(200).send({ message: "login successfully",data, token })
                }
                else { res.status(400).send('invalid password') }
            }
            else {
                res.status(400).send({ message: 'invalid email/password '})
            }
        })
    } catch (error) {
        res.status(500).send({message:err.message})
    }
}


const createAdminPackage = (req,res)=>{
    try{
        superControll.adminPackage.create(req.body,(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

const getPackagePlan = (req,res)=>{
    try{
        superControll.adminPackage.find({deleteFlag:"false"},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
   
}

const updatePackage = (req,res)=>{
    try {
        console.log(req.body)
        superControll.adminPackage.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, (err, data) => {
            if (err) { res.status(400).send({ message: 'invalid id' }) }
            else {
                console.log("line 143",data)
                res.status(200).send({ message: 'updated successfully', data })
            }
        })
    } catch (err) {
        res.status(500).send({message: 'internal server error'})
    }
}

const deletePackage = (req,res)=>{
    try {
        superControll.adminPackage.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
            console.log(data)
            if (err) { res.status(400).send({ message: 'data does not deleted' }) }
            else {
                res.status(200).send({ message: 'data deleted successfully',data})
            }
        })
    }catch (e) {
        res.status(500).send({ message: e.message })
    }
}


    module.exports={superAdminRegistration,superAdminLogin,createAdminPackage,getPackagePlan,updatePackage,deletePackage}