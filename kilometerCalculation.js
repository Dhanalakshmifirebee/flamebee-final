function locationCalc(lat1, lon1,latitude,longitude) 
{
      var R =  6371;
      var lat1 = toRad(lat1);
      var lat2 = toRad(latitude);
      var dLat = toRad(latitude-lat1);
      var dLon = toRad(longitude-lon1); 
      var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(latitude);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var resultOfKM= R * c;
      console.log('resultOfKM',Math.floor(resultOfKM))
      return Math.floor(resultOfKM);
}                        