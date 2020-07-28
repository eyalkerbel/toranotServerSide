const jwt = require('jsonwebtoken');
const Joi = require('joi');

function setToranutThisMonth(url, MongoClient, req, res) {
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
        console.log("new",data);
        if (permissionlvl === "admin") {
            const schema = Joi.object().keys({
                date: Joi.date().required(),
                name: Joi.string().required(),
                type: Joi.number().required(),
                userid: Joi.string().required(),
                toran: Joi.number().required(),
                points: Joi.number().required(),
            })
            const ValidOrNot = Joi.validate(data, schema);
            if (ValidOrNot.error === null) {
                MongoClient.connect(
                    url,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    },
                     function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("newmaindb");
                        var goodPlace = true;
                        var dataNotifcation = {
                            date: req.body.date,
                            userid: req.body.userid,
                            action: "place"
                        } 
                        dbo.collection("notifications").insertOne(dataNotifcation);
                         dbo.collection("haadafottest").find({userid:data.userid}).toArray(function(err,foundDate) {
                            var askingDate = new Date(data.date).getDate();
                            console.log("found date" , foundDate);
                            foundDate.forEach(element => {
                            var begin = new Date(element.begindate).getDate();
                            var end = new Date(element.enddate).getDate();
                            if(askingDate >= begin && askingDate <= end) {
                                console.log("not good");
                                goodPlace = false;

                            }
                        });
                        console.log("goodPlace" , goodPlace);
                        if(goodPlace == true) {
                            dbo.collection("toranutsthismonth").insertOne(data);
                            console.log(data);
                            var myPoints = data.points + 1;
                            //console.log("POINTS",myPoints);
                            dbo.collection("users").findOneAndUpdate({userid:data.userid}, {$inc: {'points': 1 } }, {new: true },function(err, response) {
                              
                                db.close();
                                console.log("final good place", goodPlace);
                                res.json(goodPlace);
                               
                            }
                            );
                        }         
                    });
                }
                );
                
                


            } else {
                db.close();
                res.status(400).json("schema blocked")
                console.log("schema blocked")
            }
        } else {
            db.close();
            res.status(400).json("not an admin");
        }
    });

}

module.exports = setToranutThisMonth;