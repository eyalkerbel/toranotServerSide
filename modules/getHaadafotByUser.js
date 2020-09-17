const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");

function getHaadafotByUser(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log(verified);
    var obi = verified.payload;
    console.log("obi", obi );


    var userid = req.body.userid;
    console.log("userid",userid);
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
         dbo.collection("users").findOne({userid:userid}).then(items => {
         console.log("items first" , items);
           return dbo.collection("haadafottest")
            .find({
              idUser:items._id
            })
            .toArray(function (err, result) {
              if (result.length === 0) {
                console.log("lookup failed");
                res.status(200).send(result);
                db.close();
              } else {
                     console.log("good");
                res.status(200).json(result);
                db.close();
              }
            });
          });
      

});
  });
}
module.exports = getHaadafotByUser;