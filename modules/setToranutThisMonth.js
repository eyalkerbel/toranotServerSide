const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { resolve } = require('path');

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
                         dbo.collection("haadafottest").find({userid:data.userid}).toArray(async function(err,foundDate) {
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
                      //  console.log("dssdsddssd" , data.userid);
                        
                        var userDetails = await Get_IDByUserID(dbo,data.userid);
                   //     console.log("_id" , _id);
                        var newData = {
                            date: data.date,
                           userDetails: userDetails,
                            toran: req.body.toran,
                            userStatus: "unknown"
                        };
                        console.log("goodPlace" , goodPlace);
                        if(goodPlace == true) {
                            dbo.collection("toranutsthismonth").insertOne(newData);
                            console.log(data);
                            var myPoints = data.points + 1;
                            //console.log("POINTS",myPoints);
                            dbo.collection("users").findOneAndUpdate({userid:data.userid}, {$inc: {'points': 1 } }, {new: true },function(err, response) {
                                console.log("final good place", goodPlace);
                                res.json(goodPlace);
                                db.close();

                            }
                            );
                        }         
                    });
                }
                );
                
                


            } else {
                res.status(400).json("schema blocked")
                db.close();
                console.log("schema blocked")
            }
        } else {
            res.status(400).json("not an admin");
            db.close();
        }
    });

}

 function Get_IDByUserID(dbo,userid) {
    // dbo.collection("users").findOne({"userid": userid},function(err,response) {
    //     console.log("response" , response);
    // });
return new Promise(resolve => dbo.collection("users").findOne({"userid": userid},function(err,response) {
    console.log("response" , response);
     resolve(response);
}));
}

module.exports = setToranutThisMonth;
// module.exports = Get_IDByUserID;