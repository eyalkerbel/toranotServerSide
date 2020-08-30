
const jwt = require("jsonwebtoken");
function getMessage(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      var sendable = [];
      console.log("verfid" , verified);
      var obi = verified.payload;
      if(obi.userid != null) {
        var userid = obi.userid;
      } else {
        var userid = obi.sn;
      }
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
          console.log("dd");
          dbo.collection("toranotexchanges").updateMany({}, {"$set":{"seen": true}}, function(err,result) {
           console.log("need to update");
            if(err) {
              console.log("error" , err);
            }
          });
          dbo.collection("toranotexchanges").find({
            'newDate.userid':userid
            })
            .toArray(function (err, result) {
                var array=[];
              if (result.length === 0) {
                console.log("lookup failed");
                db.close();
              res.status(200).send(result);
              } else {
               // sendable.push(result);
                console.log("data",result);
                res.status(200).json(result);
                db.close();

              }
            });
        }
      );
    });
}

function GetNameById(dbo,id) {
    dbo.collection("users").find({
        userid:id
        })
}


module.exports = getMessage;