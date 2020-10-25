const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { ObjectId } = require("mongodb");
const addNewNotification = require("../Notifications/addNewNotification");
function approveExchange(url,MongoClient,req,res) {
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
      console.log("userid hadd",req.body);
      var idUser = obi._id;

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
          var data = req.body;
          var isApprove = data.isApprove;
          var newMessage = data.newMessage;
          var exchange_id = data.index._id;
          const {toranotOld} = data.index;
          console.log("date" , data);          
          if(isApprove == true) {
          const promise1 = dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(exchange_id)},{"$set":{"status": "agree","newMessage": newMessage }},{});
          const promise2 = addNewNotification(dbo,new ObjectId(toranotOld._id),ObjectId(toranotOld.idUser),new ObjectId(idUser),"toranApprove");
         // const promis3 = addNewNotificationManger(dbo,data.index,
          Promise.all([promise1,promise2]).then(values => {
            res.status(200).json("succsees");
            db.close();
          })
        } else {
          const promise1 = dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(exchange_id)},{"$set":{"status": "reject","newMessage": newMessage}},{});
          const promise2 = addNewNotification(dbo,new ObjectId(toranotOld._id),ObjectId(toranotOld.idUser),new ObjectId(idUser),"toranReject");
          Promise.all([promise1,promise2]).then(values => {
            res.status(200).json("succsees");
            db.close();
          })
        }
    
         
});
});
}

module.exports = approveExchange;