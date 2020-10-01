const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const addNewNotificationForManager = require("../Notifications/addNewNotificationForManager");

function SendMessageAgain(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var spliited = BearerHeader.split(" ");
    jwt.verify(spliited[1] , "iamthesecretkey" , (err,verifed) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
          }
          var sendable = [];
          var obi = verifed.payload;
      //    var userids = obi.userid;
        var data = req.body;
       const {item , message, sendTo,fisrtTime} = data;
        console.log("item" , item , "message" , message , sendTo , fisrtTime);
        //  console.log("userid" , userids);
          MongoClient.connect(url ,{useNewUrlParser: true,
            useUnifiedTopology: true},
            function (err, db) {
                if (err) throw err;
                var dbo = db.db("newmaindb");
                if(fisrtTime == true) {
              //    dbo.collection("toranotexchanges").updateOne({ "_id":ObjectId(item.id)},{"$set":{"oldMessage": message,"status": "askingManager"}},{upsert: true},function(err, response) {  
              //    });
                }
                if(sendTo == "user") {
                dbo.collection("toranotexchanges").updateOne({ "_id":ObjectId(item.id)},{"$set":{"oldMessage": message,"status": "asking"}},{upsert: true},function(err, response) { 
                  db.close();
 
                });
                } else { // taking with manager
                  const promise1 = dbo.collection("toranotexchanges").updateOne({ "_id":ObjectId(item.id)},{"$set":{"oldMessage": message,"status": "convincing"}},{upsert: true}); 
                  const promise2 = addNewNotificationForManager(dbo,ObjectId(item.id),"askManager");
                  Promise.all([promise1,promise2]).then(values => {
                    db.close();

                  })

                 
                }
        });
});
}

module.exports = SendMessageAgain;