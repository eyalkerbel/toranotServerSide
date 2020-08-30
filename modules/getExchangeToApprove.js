const jwt = require("jsonwebtoken");


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
        MongoClient.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (err, db) {
                if (err) throw err;
                var sendable = [];
                var dbo = db.db("newmaindb");
                dbo.collection("toranotexchanges").find({status: "convincing"}).toArray(function(err, found){
                    console.log("found " , found);
                    res.status(200).json(found);
                    db.close();
                });
            });
        });
}

module.exports = getExchangeToApprove;