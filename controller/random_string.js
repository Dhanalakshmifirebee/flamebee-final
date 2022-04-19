exports.randomString = (length) => {
  let random = "";
  let character = "0123456789";
  for (let i = 0; i <= length; i++) {
    random += character.charAt(Math.floor(Math.random() * character.length));
  }
  // console.log(random)
  return random;
};

exports.makeId=(length)=>{
  let makeid="";
  let character="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for(let i=0;i<=length;i++){
    makeid+=character.charAt(Math.floor(Math.random()*character.length));
  }
  return makeid;
};














