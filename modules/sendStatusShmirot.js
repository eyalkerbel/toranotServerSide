const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const { promises } = require("fs");


function sendStatusShmirot(url, MongoClient, req, res, db) {
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
    const { temp, month } = req.body;
    console.log("userid hadd", userid);

    var dbo = db.db("newmaindb");
    console.log("temp", temp, " month ", month, req.body);

    const promises = temp.map(async tempi => {

      return updateUserStatus(dbo, tempi, "toranots");
      //  }
    });
    Promise.all(promises).then(() => {
      console.log("finsh");
    }
    );

  });
}

function updateUserStatus(dbo, temp, collectionName) {
  console.log("temp", temp);
  return new Promise(resolve => dbo.collection(collectionName).updateOne({ "_id": ObjectId(temp.id) }, { "$set": { "userStatus": temp.status } }, { upsert: true }, function (err, response) {
    resolve(response);
  }));
}

function updateNextMonth(dbo, temp) {

}



module.exports = sendStatusShmirot;