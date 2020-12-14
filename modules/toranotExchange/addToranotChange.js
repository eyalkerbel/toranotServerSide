const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const addNewNotification = require("../Notifications/addNewNotification");
function addTotanotChange(url, MongoClient, req, res, db) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", async (err, verified) => {
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
    var data = req.body;

    var dbo = db.db("newmaindb");
    console.log("req body", req.body);

    data["toranotIdNew"] = ObjectId(data.toranotIdNew);
    data["toranotIdOld"] = ObjectId(data.toranotIdOld);
    //   await insertData(data);
    console.log("data", data);
    //   const promise1 = dbo.collection("notifications").insert(noti);

    var freindId = await GetIdPersonByToranotId(dbo, req.body.toranotIdOld);
    var userId = await GetIdPersonByToranotId(dbo, req.body.toranotIdNew);
    const promise1 = addNewNotification(dbo, ObjectId(req.body.toranotIdNew), userId, freindId, "wantExchange");
    //const promise1 = addNewNotification(dbo,userd,freindId,ObjectId(req.body.toranotIdNew),"wantExchange")
    const promsie2 = dbo.collection("toranotexchanges").insert(data);
    Promise.all([promise1, promsie2]).then(values => {
      res.status(200).json("succeed");
    });

  });
}
function GetIdPersonByToranotId(dbo, toranotId) {
  return new Promise((resolve) => dbo.collection("toranots").findOne({ "_id": ObjectId(toranotId) }).then(element => resolve(element.idUser)));
}

function insertData(data) {
  data["toranotIdOld"] = ObjectId(data.toranotIdOld);
  data["toranotIdNew"] = ObjectId(data.toranotIdNew);
  console.log("finishInsert", data);
  return data;
}

module.exports = addTotanotChange;