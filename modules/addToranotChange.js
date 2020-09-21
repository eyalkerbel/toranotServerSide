const jwt = require("jsonwebtoken");
const Joi = require("joi");

function addTotanotChange(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log("verfid" , verified);
      var obi = verified.payload;
      if(obi.userid != null) {
        var userid = obi.userid;
      } else {
        var userid = obi.sn;
      }
      var name = obi.name;
      console.log("userid hadd",userid);
      // console.log("req.body" , req.body);
      var data = req.body;
      var noti = {
        oldData: req.body.oldDate,
        newDate: req.body.newDate,
        seen: false,
        action: "change"
      }
   // console.log("send message beckend",names)
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
         function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          console.log("req body" , req.body);
          dbo.collection("toranotexchanges").insert(data).then(() => db.close());
   
});
});
}

module.exports = addTotanotChange;