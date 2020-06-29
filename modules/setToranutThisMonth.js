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
                        dbo.collection("toranutsthismonth").insertOne(data);
                        console.log(data);
                        var myPoints = data.points + 1;
                        //console.log("POINTS",myPoints);
                        dbo.collection("users").findOneAndUpdate({userid:data.userid}, { $inc: {'points': 1 } }, {new: true },function(err, response) {
                            if (err) {
                            console.log("error");
                           } else {
                               console.log("succsed",response);
                           }
                        }
                        );
                       // dbo.collection("toranutsthismonth").update({userid:data.userid},{'$set': {'points': myPoints}} , function(err){});
                    
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

module.exports = setToranutThisMonth;