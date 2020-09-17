const jwt = require("jsonwebtoken");

function getThisMonthsToranuts(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log(verified);
    console.log(err)
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth();
   // console.log("current Month" , currentMonth);
    var obi = verified.payload;
    var userid = obi.userid;
    var temp = [];
   // console.log("userid" , userid);
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("newmaindb");
        dbo
          .collection("toranutsthismonth")
          .find({userid:userid })
          .toArray(function (err, result) {
            if (result.length === 0) {
              // console.log("lookup failed");
              res.status(400).json([])
            } else {
              for(var i=0;i<result.length;i++) {
                var newDate = new Date(result[i].date);
               if(currentMonth == newDate.getMonth()) {
                  temp.push(result[i]);
               }
              }
              console.log("next month toranut" , temp);
              res.json(temp);
              db.close();
            }
          });
      }
    );
  });
}

module.exports = getThisMonthsToranuts;
