const jwt = require("jsonwebtoken");

function getAllThisMonthsToranuts(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified);
        console.log(err)

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
                    .find({})
                    .toArray(function (err, result) {
                        if (result.length === 0) {
                            console.log("lookup failed");
                        } else {
                            sendable.push(result);
                        }
                    });
                ;
                dbo.collection("toranutsnextmonth")
                    .find({})
                    .toArray(function (err, result) {
                        if (result.length === 0) {
                            console.log("lookup failed");
                        } else {
                            sendable.push(result);
                            console.log(sendable)
                            res.json(sendable)
                        }
                    });
                db.close();

            }
        );
    });
}

module.exports = getAllThisMonthsToranuts;
