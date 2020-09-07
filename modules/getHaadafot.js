const jwt = require("jsonwebtoken");

function getHaadafot(url, MongoClient, req, res) {
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
        dbo
          .collection("haadafottest")
          .find({
            userid:userid
          })
          .toArray(function (err, result) {
            if (result.length === 0) {
              console.log("lookup failed");
              res.status(200).send(result);
              db.close();
            } else {
                    console.log(result);
              res.status(200).json(result);
              db.close();
            }
          });
      }
    );
  });
}

module.exports = getHaadafot;
