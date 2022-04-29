
const nodeGeocoder = require('node-geocoder');


let options = { provider: 'openstreetmap'}
                                       let geoCoder = nodeGeocoder(options);
                                       const convertAddressToLatLon=await(geoCoder.geocode(req.body.drop))
                                       console.log('line 25',convertAddressToLatLon)
                                       
                                       req.body.dropLocation = {"dropLatitude":convertAddressToLatLon[0].latitude,"dropLongitude":convertAddressToLatLon[0].longitude}
                                       console.log('line 28',req.body.dropLocation)


