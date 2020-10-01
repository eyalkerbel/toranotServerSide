const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {ObjectId} = require("mongodb");
const deleteNotifications = require("./deleteNotifications");
function deleteNotifactionsByIndex(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log("verfid" , verified);
      var obi = verified.payload;
      var idUser = obi._id;
      console.log("deleteNotificationByIndex",req.body);
      const {indexDeleting} = req.body;
      // console.log("req.body" , req.body);
      var data = req.body;
    
   // console.log("send message beckend",names)
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
         async function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          console.log("deleteNotifByIndex");
          deleteNotifications(dbo,idUser,indexDeleting).then(() => db.close());
         })
        });
}

module.exports = deleteNotifactionsByIndex;