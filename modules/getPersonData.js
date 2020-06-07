const jwt = require("jsonwebtoken");

function getPersonData(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log("person data",verified);
    var obi = verified.payload;
    console.log(obi);
    var userid = obi._id;
    console.log("userid",userid);
    MongoClient.connect(
      url,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("toranot");
        dbo
          .collection("users")
          .find({
            userid
          })
          .toArray(function (err, result) {
            if (result.length === 0) {
              console.log("lookup failed");
              console.log(result,obi);
              res.status(200).send(obi);
            } else {
                  res.status(200).json(obi);
              db.close();
            }
          });
      }
    );
  });
}

module.exports = getPersonData;