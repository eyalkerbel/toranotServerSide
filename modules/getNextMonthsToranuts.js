const jwt = require("jsonwebtoken");

function getNextMonthsToranuts(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt");
      return;
    }
    console.log(verified);
    console.log(err);

    var obi = verified.payload;
    var userid = obi.userid;
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("newmaindb");
        dbo
          .collection("toranutsnextmonth")
          .find({ userid })
          .toArray(function (err, result) {
            if (result.length === 0) {
              console.log("lookup failed");
              res.status(400).json([]);
              db.close();
            } else {
              res.json(result);
              db.close();
            }
          });
      }
    );
  });
}

module.exports = getNextMonthsToranuts;
