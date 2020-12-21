const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const deleteNotifications = require("./deleteNotifications");
function deleteNotifactionsByIndex(url, MongoClient, req, res, db) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log("verfid", verified);
    var obi = verified.payload;
    var idUser = obi._id;
    console.log("deleteNotificationByIndex", req.body);
    const { indexDeleting } = req.body;
    // console.log("req.body" , req.body);
    var data = req.body;

    // console.log("send message beckend",names)

    var dbo = db.db("newmaindb");
    console.log("deleteNotifByIndex");
    deleteNotifications(dbo, idUser, indexDeleting);
  })
}

module.exports = deleteNotifactionsByIndex;