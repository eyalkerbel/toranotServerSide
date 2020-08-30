const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");


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
          
          for(var i=0;i<temp.length;i++) {
            if(month == 0) {
              dbo.collection("toranutsthismonth").updateOne({"_id" : ObjectId(temp[i].id)}, {"$set":{"userStatus": temp[i].status}},{upsert: true},function(err,response){
                  console.log(response)
              });
            }
              else {
                dbo.collection("toranutsthismonth").updateOne({"_id" : ObjectId(temp[i].id)}, {"$set":{"userStatus": temp.status}},{upsert: true},function(err,response){
                });
              }
            }
          
          db.close();
        });
    });
}

module.exports = sendStatusShmirot;