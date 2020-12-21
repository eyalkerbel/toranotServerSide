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
    var data = req.body;
    var dbo = db.db("newmaindb");
    if (data.toranotIdNew != null) {
      data["toranotIdNew"] = ObjectId(data.toranotIdNew);
    }
    if (data.toranotIdOld != null) {
      data["toranotIdOld"] = ObjectId(data.toranotIdOld);
    }
    delete data.toranotNew;
    delete data.toranotOld;
    if (data.rejectedIDS != undefined) {

      data["rejectedIDS"][0] = ObjectId(obi._id);
    }
    //   await insertData(data);
    console.log("data", data);
    //   const promise1 = dbo.collection("notifications").insert(noti);
    var freindId = null;
    var userId = null;

    if (req.body.toranotIdOld != null) {
      var freindId = await GetIdPersonByToranotId(dbo, req.body.toranotIdOld);
    }
    if (req.body.toranotIdNew != null) {
      var userId = await GetIdPersonByToranotId(dbo, req.body.toranotIdNew);
    }
    if (userId != null && freindId != null) {
      const promise1 = addNewNotification(dbo, ObjectId(req.body.toranotIdNew), userId, freindId, "wantExchange");
    } else {
      const promise1 = new Promise(resolve => resolve(true));
    }
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