const jwt = require('jsonwebtoken');
const Joi = require('joi');

function getUsersAndToranuts(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified);
        var obi = verified.payload;
        var permissionlvl = obi.permissionlvl;
        var data = req.body;

        if (permissionlvl === "admin") {
            MongoClient.connect(
                url,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                function (err, db, ) {
                    if (err) throw err;
                    var dbo = db.db("newmaindb");
                    var sendable = [];

                    dbo.collection("users").find({})
                        .toArray(function (err, result) {
                            if (result.length === 0) {
                                console.log("lookup failed");
                                sendable.push(result)
                            } else {
                                sendable.push(result)
                            }
                        });
                    dbo.collection("toranutsthismonth")
                        .find({})
                        .toArray(function (err, result) {
                            if (result.length === 0) {
                                console.log("lookup failed");
                                sendable.push(result);
                            } else {
                                sendable.push(result);
                            }
                        });
                    ;
                    dbo.collection("toranutsnextmonth")
                        .find({})
                        .toArray(function (err, result) {
                            if (result.length === 0) {
                                sendable.push(result);
                                console.log("lookup failed");
                                res.json(sendable)
                            } else {
                                sendable.push(result);
                                console.log(sendable)
                                res.json(sendable)
                            }
                        });
                    db.close();
                }
            );
        } else {
            res.status(400).json("not an admin");
        }
    });

}

module.exports = getUsersAndToranuts;