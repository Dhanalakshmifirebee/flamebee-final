
const geolib = require("geolib");
const {driverDetails}=require('./driver_model')


exports.location=(req,res)=>{
    driverDetails.find({deleteFlag:'false'},(err,data)=>{
        if(err)throw err
        console.log('line 9',data)
        const datas=data.filter(((result)=>filterLocation(result,50000,req.params.latitude,req.params.longitude)))
        res.status(200).send({message:"nearby driver details",datas})
    })
    
}

function filterLocation(result,radius=50000,latitude,longitude)
    {
      if (!result.driverLocation){
        return false;
      }
      console.log('line 21',result.driverLocation.driverLatitude);
      console.log('line 22',result.driverLocation.driverLongitude);
      var x = geolib.isPointWithinRadius(
        {
          latitude: result.driverLocation.driverLatitude,
          longitude: result.driverLocation.driverLongitude,
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
