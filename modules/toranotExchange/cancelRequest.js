const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");

function cancelRequest(MongoClient, url, req, res, db) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log("verfid", verified);
    var obi = verified.payload;
    if (obi.userid != null) {
      var userid = obi.userid;
    } else {
      var userid = obi.sn;
    }
    var name = obi.name;
    console.log("userid hadd", req.body);


    // console.log("send message beckend",names)

    var dbo = db.db("newmaindb");
    var data = req.body;
    var exhcangeId = data.item._id
    dbo.colletion("toranotexchanges").deleteOne({ "_id": ObjectId(exhcangeId) }).then(() => {
      res.status(200).json("succsess");
    });

  });
}

module.exports = cancelRequest;