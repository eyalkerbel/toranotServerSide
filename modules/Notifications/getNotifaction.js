const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");

function getNotifaction(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var spliited = BearerHeader.split(" ");
    jwt.verify(spliited[1] , "iamthesecretkey" , (err,verifed) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
          }
          var sendable = [];
          var obi = verifed.payload;
          var userids = obi.userid;
        //  console.log("userid" , userids);
        var idUser = obi._id;
        console.log("isUser" , idUser);
          MongoClient.connect(url ,{useNewUrlParser: true,
            useUnifiedTopology: true},
            function (err, db) {
                if (err) throw err;
                var dbo = db.db("newmaindb");
                if(obi.permissionlvl == 'user') {
                // const promise1 = new Promise(resolve => dbo.collection("notifications").find({userid:userids}).toArray().then(result => resolve(result)));
                const promise1 = new Promise(resolve => dbo.collection("notifications").aggregate([
                  { $lookup:  {
                      from: "toranots",
                      localField: "toranotId",
                      foreignField: "_id",
                      as: "toranot" 
                    }}, { $unwind: {
                      path: "$toranot",
                      preserveNullAndEmptyArrays: true
                    }}, {$match:{
                      $and:[{"toranot.idUser" : ObjectId(idUser)}]
                  } },
                  { $lookup:  {
                    from: "users",
                    localField: "friendId",
                    foreignField: "_id",
                    as: "userDetails" 
                  }}, { $unwind: {
                    path: "$userDetails",
                    preserveNullAndEmptyArrays: true
                  }}
                ]).toArray().then(result => resolve(result)));

                
                
                
                const promise2 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
                  { $lookup: {
                       from: "toranots",
                       localField: "toranotIdOld",
                       foreignField: "_id",
                       as: "toranotOld"
                       }},{ $unwind: {
                      path: "$toranotOld",
                      preserveNullAndEmptyArrays: true
                    }},
                   { $lookup: {
                          from: "users",
                          localField: "toranotOld.idUser",
                          foreignField: "_id",
                          as: "toranotOld.userDetails"
                   }},{ $unwind: "$toranotOld.userDetails" },
                     {$match:{
                          $and:[{"toranotNew.userDetails.userid" : userids}]
                      } },
                   { $lookup:{
                       from: "toranots",
                       localField: "toranotIdNew",
                       foreignField: "_id",
                       as: "toranotNew"
                      } }, {$unwind: "$toranotNew"},
                  { $lookup:{
                          from: "users",
                          localField: "toranotNew.idUser",
                          foreignField: "_id",
                          as: "toranotNew.userDetails"
                      }},  { $unwind: "$toranotNew.userDetails"},
                  ]).toArray().then(result => resolve(result)));

                  Promise.all([promise1,promise2]).then(values => {
                    console.log("values" , values[0]);
                      sendable.push(values[0]);
                      sendable.push(values[1]);
                      res.json(sendable);
                      db.close();
                  });
                } else {
           const promise1=   dbo.collection("notificationsManager").aggregate([
                    { $lookup : {
                      from: "toranotexchanges",
                      localField: "exchange",
                      foreignField: "_id",
                      as: "exchangeObject"
                      }},{ $unwind: {
                     path: "$exchangeObject",
                     preserveNullAndEmptyArrays: true
                    } },{ $lookup: {
                      from: "toranots",
                      localField: "exchangeObject.toranotIdOld",
                      foreignField: "_id",
                      as: "exchangeObject.toranotOldObject"
               }},{ $unwind: "$exchangeObject.toranotOldObject" },
               { $lookup: {
                from: "users",
                localField: "exchangeObject.toranotOldObject.idUser",
                foreignField: "_id",
                as: "exchangeObject.toranotOldObject.userDetails"
         }},{ $unwind: "$exchangeObject.toranotOldObject.userDetails" },
                 { $lookup: {
                      from: "toranots",
                      localField: "exchangeObject.toranotIdNew",
                      foreignField: "_id",
                      as: "exchangeObject.toranotNewObject"
               }},{ $unwind: "$exchangeObject.toranotNewObject" },
               { $lookup: {
                from: "users",
                localField: "exchangeObject.toranotNewObject.idUser",
                foreignField: "_id",
                as: "exchangeObject.toranotNewObject.userDetails"
         }},{ $unwind: "$exchangeObject.toranotNewObject.userDetails" },
                    
                  ]).toArray().then(result => result);
                
                  Promise.all([promise1]).then(values => {
                    console.log("values" , values[0][0]);
                    sendable.push(values[0]);
                    res.json(sendable);
                    db.close();
                  })
                }

            }
                );
    });
}


module.exports = getNotifaction;