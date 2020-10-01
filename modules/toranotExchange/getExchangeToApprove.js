const jwt = require("jsonwebtoken");
const deleteNotifications = require("../Notifications/deleteNotifications");

function getExchangeToApprove(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
    //    console.log(verified);
      //  console.log(err)

        var obi = verified.payload;
        var userid = obi.userid;
        var idUser = obi._id;
        MongoClient.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (err, db) {
                if (err) throw err;
                var sendable = [];
                var dbo = db.db("newmaindb");
              const promise1 =   dbo.collection("toranotexchanges").aggregate([
                    { $match: {status: "convincing"}},
                    { $lookup:
                       {
                         from: "toranots",
                         localField: "toranotIdOld",
                         foreignField: "_id",
                         as: "toranotOld"
                       }
                     },{ $unwind: {
                        path: "$toranotOld",
                        preserveNullAndEmptyArrays: true
                      }},  
                     { $lookup:
                        {
                            from: "users",
                            localField: "toranotOld.idUser",
                            foreignField: "_id",
                            as: "toranotOld.userDetails"
                        }
                     },{$unwind: "$toranotOld.userDetails"},
                     { $lookup: {
                         from: "toranots",
                         localField: "toranotIdNew",
                         foreignField: "_id",
                         as: "toranotNew"
                        }},{ $unwind: "$toranotNew"},
                    { $lookup:
                        {
                            from: "users",
                            localField: "toranotNew.idUser",
                            foreignField: "_id",
                            as: "toranotNew.userDetails"
                        }
                     }, {$unwind: "$toranotNew.userDetails"},
                    
                    ]).toArray();
                //     (function(err, found){
                //     console.log("found " , found);
                //     res.status(200).json(found);
                //     db.close();
                // });

                 const promise2 = deleteNotifications(dbo,idUser,"askingManager");
                 Promise.all([promise1,promise2]).then(values => {
                     res.status(200).json(values[0]);
                     db.close();
                 })

            });
        });
}

module.exports = getExchangeToApprove;