const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongodb = require("mongodb")

function deleteToranutThisMonth(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log("VERFIED",req.body);
        var obi = verified.payload;
        var permissionlvl = obi.permissionlvl;
        var _id = req.body.id;
        
        if (permissionlvl === "admin") {
            const schema = Joi.string().required()
            console.log(_id)
            const ValidOrNot = Joi.validate(_id, schema);
            if (ValidOrNot.error === null) {
                MongoClient.connect(
                    url,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    },
                    function (err, db) {
                        if (err) throw err;

                        var dataNotifcation = {
                            date: req.body.date,
                            userid: req.body.userid,
                            action: "delete"
                        }
                        var dbo = db.db("newmaindb");
                        dbo.collection("notifications").insert(dataNotifcation);
                        dbo.collection("toranutsthismonth").deleteOne({ _id: new mongodb.ObjectId(_id) }, function (err, obj) {
                            if (err) throw err;
                            console.log("1 document deleted");
                            });
                            var userid = req.body.userid;
                            console.log("userid",userid);
                            var points;
                            // dbo.collection("users").find({userid:userid}).toArray(function (err, result) {
                            //       console.log("result",result);
                            //       points = result.points;
                            // });
                              //  dbo.collection("users").update({userid:userid},{'$set': {'points': points - 1}} , function(err){});
                              dbo.collection("users").findOneAndUpdate({userid:userid}, { $inc: {'points': -1 } }, {new: true },function(err, response) {});

                            db.close();
                                
                       
                        console.log("im here")
                        db.close();
                        res.status(200).json("success");
                    }
                
                );
                
            } else {
                res.status(400).json("schema blocked")
                console.log("schema blocked")
            }
        } else {
            res.status(400).json("not an admin");
        }
    });

}

module.exports = deleteToranutThisMonth;