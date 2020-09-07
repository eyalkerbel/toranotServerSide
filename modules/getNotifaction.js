const jwt = require("jsonwebtoken");


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
          MongoClient.connect(url ,{useNewUrlParser: true,
            useUnifiedTopology: true},
            function (err, db) {
                if (err) throw err;
                var dbo = db.db("newmaindb");
                dbo.collection("notifications").find({userid:userids}).toArray(function (err, result) {
                    if(err) {
                        console.log("error");
                        sendable.push(result);
                        // res.json(sendable);                                   
                    } else {
                        sendable.push(result);
                      //  res.json(sendable);
                    }
                });
              //  console.log("getNotifaction");
                dbo.collection("toranotexchanges").find( {'newDate.userid':userids }).toArray(function (err, result) {
                  //  console.log("exchanges id", result);
                    if(err) {
                        console.log("error");
                        sendable.push(result);
                      res.json(sendable);
                      db.close();
                    } else {
                //      console.log("result n " , result)
                        sendable.push(result);
                        
                        res.json(sendable);
                        db.close();

                    }
                });

            }
                );
    });
}


module.exports = getNotifaction;