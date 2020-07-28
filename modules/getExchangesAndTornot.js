const jwt = require("jsonwebtoken");
const { send } = require("process");


function getExchangesAndTornot(url,MongoClient,req,res) {
    console.log("getExchangesAndTornot server");
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
                dbo.collection("toranutsthismonth")
                .find({userid:userid})
                .toArray(function (err, result) {
                    sendable.push(result);
                });
                dbo.collection("toranutsnextmonth")
                .find({userid:userid})
                .toArray(function (err, result) {
                    if(result == []) {
                        sendable.push([null]);
                    } else {
                    sendable.push(result);
                    }
                });
                dbo.collection("toranotexchanges").find( {'oldDate.userid':userid}).toArray(function (err, result) {
                    //console.log("exchanges id", result);
                    if(result == []) {
                        sendable.push([null]);
                    } else {
                    sendable.push(result);
                    }

                });
                dbo.collection("toranotexchanges").find( {'newDate.userid':userid}).toArray(function (err, result) {
                  //  console.log("exchanges id", result);
                    if(err) {
                        console.log("error");
                        sendable.push(result);
                      res.json(sendable)
                    } else {
                        sendable.push(result);
                        res.json(sendable)
                    }
                });
                

                db.close();
            });
});
}
module.exports = getExchangesAndTornot;