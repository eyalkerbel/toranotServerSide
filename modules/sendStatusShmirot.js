const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { promises } = require("fs");


function sendStatusShmirot(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log(verified);
      var obi = verified.payload;
      var userid = obi.userid;
      console.log(req.body);
      const {temp,month} = req.body;
      console.log("userid hadd",userid);
      MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
         function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          console.log("temp" , temp , " month " , month , req.body);
      
      const promises = temp.map(async tempi => { 
            if(month == 0) {
           //   console.log("_id" , temp[i].id)
              return updateUserStatus(dbo,tempi,"toranutsthismonth");
            }
              else {
               return updateUserStatus(dbo,tempi,"toranutsnextmonth");
              }
            })
          Promise.all(promises).then(() => {
            console.log("finsh");
          db.close();
          }
        );
          
        });
    });
}

function updateUserStatus(dbo,temp,collectionName) {
  return new Promise(resolve => dbo.collection(collectionName).updateOne({"_id" : ObjectId(temp.id)}, {"$set":{"userStatus": temp.status}},{upsert: true},function(err,response){
    resolve(response);
}));
}

function updateNextMonth(dbo,temp) {

}



module.exports = sendStatusShmirot;