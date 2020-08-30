// const getThisMonthsToranuts = require("./getThisMonthsToranuts");
// import {getThisMonthsToranuts} from "./getThisMonthsToranuts";

function updateToranotDate(url,MongoClinet,req,res) {
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
                       
}