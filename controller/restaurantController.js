const restaurantController = require('../model/restaurantSchema')
const adminController = require('../model/adminSchema')
const jwt = require('jsonwebtoken')


const image = (req,res)=>{
    try{
        req.body.image = `http://192.168.0.112:8612/uploads/${req.file.filename}`
        console.log(req.body)
        restaurantController.image.create(req.body,(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data}) 
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

// Restaurant

const createRestaurant = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        restaurantController.restautant.countDocuments({restaurantEmail:req.body.restaurantEmail},(err,data)=>{
            if(data==0){
                req.body.restaurantOwnerId = verifyId
                restaurantController.restautant.create(req.body,(err,data1)=>{
                    if(err) throw err
                    res.status(200).send({message:"Restaurant created Successfully",data1})
                })
            }
            else{
                res.status(400).send({message:"email id already exist"})
            }
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const getSpecificRestaurant = (req,res)=>{
    try{
        const adminToken = jwt.decode(req.headers.authorization) 
        const verifyId = adminToken.userid
        console.log(verifyId)
        restaurantController.restautant.findOne({restaurantOwnerId:verifyId},(err,data)=>{
            console.log(data.restaurantOwnerId)
            if(err) throw err

            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}


const updateRestaurant = (req,res)=>{
    try {
        console.log(req.body)
        restaurantController.restautant.findOneAndUpdate({_id:req.params.id}, req.body, { new: true }, (err, data) => {
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

const removeRestaurant = (req,res)=>{
    console.log(req.params.id)
    try {
        restaurantController.restautant.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { returnOriginal: false }, (err, data) => {
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

// Food

const addFood =async(req,res)=>{
   try{
        console.log(req.body.restaurantId)
        const z = await restaurantController.restautant.findById(req.body.restaurantId)
        console.log('z', z)
        req.body.restaurantDetails = z
        restaurantController.menu.create(req.body, (err, data) => {
            if (err) { console.log(err) }
            else {
                console.log(data)
                res.status(200).send({ message: data, statusCode: 200 })
            }
        })
    }
    catch(err){
        res.status(500).send({message:err.message})
    }
}

const getFoodByOwner = (req,res)=>{
    try{
        restaurantController.menu.find({ restaurantId: req.params.restaurantId, deleteFlag: 'false' }, (err, data) => {
            console.log(data)
            if (err) {
                res.status(400).send({ message: 'invalid restaurantid' }) }
            else {
                var count=data.length
                console.log(count)
                const datas=paginated.paginated(data,req,res)
                console.log(datas)
                res.status(200).send({ message: datas,count})
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}


const updateFood = (req,res)=>{
    try{
        console.log(req.body)
        restarauntSchema.addAvaliableFood.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, data) => {
            if (err) { res.status(400).send({ message: 'invalid restarauntid' }) }
            else {
                console.log(data)
                res.status(200).send({ message: data, statusCode: 200 })
            }
        })
    }catch(err){
        res.status(500).send({message:err.message})
    }
}

const deleteFood = (req, res) => {
    restarauntSchema.addAvaliableFood.findByIdAndUpdate(req.params.id, { deleteFlag: "true" }, { new: true }, (err, data) => {
        if (err) { res.status(400).send({ message: 'data is not deleted yet' }) }
        else {
            console.log(data)
            res.status(200).send({ message: 'data deleted successfully' })
        }
    })
}

const filterFoodByPriceLowToHigh = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:1}}],(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
    
}

const filterFoodByPriceHighToLow = (req,res)=>{
    try{
        restaurantController.menu.aggregate([{$sort:{foodPrice:-1}}],(err,data)=>{
            if(err) throw err
            console.log(data)
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

// const getFoodByPrice = (req,res)=>{
//     restaurantController.menu.aggregate([{$sort:{foodPrice:1}}],(err,data)=>{
//         if(err) throw err
//         console.log(data)
//     })
// }




//Restaurant Review

const createRestaurantReview = (req,res)=>{
    try{
        const token = jwt.decode(req.headers.authorization)
        const verify = token.userid
        adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
            console.log(data1)
            if(data1){
                req.body.userId = data1._id
                req.body.userName = data1.name
                restaurantController.restaurantReview.create(req.body,(err,data2)=>{
                    if(err) throw err
                    res.status(200).send({message:data2})
                })
            }
            else{
                res.status(400).send({message:"Invalid token"})
            }
            
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
} 

const getRestaurantReview = (req,res)=>{
    try{
        restaurantController.restaurantReview.find({restaurantId:req.params.id},(err,data)=>{
            if(err) throw err
            res.status(200).send({message:data})
        })
    }
    catch(err){
        res.status(500).send({message:err})
    }
}

// Rating

const restaurantRating = (req,res)=>{
    const token = jwt.decode(req.headers.authorization)
    const verify = token.userid
    adminController.adminSchema.findOne({_id:verify},(err,data1)=>{
        console.log(data1)
        if(data1){
            req.body.userId = data1._id
            restaurantController.restaurantRating.create(req.body,(err,data2)=>{
                if(err) throw err
                res.status(200).send({message:data2})
            })
        }
    })
}

module.exports={
    image,
    createRestaurant,
    getSpecificRestaurant,
    updateRestaurant,
    removeRestaurant,
    addFood,
    getFoodByOwner,
    updateFood,
    deleteFood,
    filterFoodByPriceLowToHigh,
    filterFoodByPriceHighToLow,
    getFoodByPrice,
    createRestaurantReview,
    getRestaurantReview,
    restaurantRating
}