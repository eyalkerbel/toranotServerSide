const jwt = require('jsonwebtoken');
const Joi = require('joi');

function setToranutNextMonth(url, MongoClient, req, res) {
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
                        dbo.collection("toranutsnextmonth").insertOne(data);
                        db.close();
                        res.status(200).json("success");
                    }
                );
            } else {
                res.status(400).json("schema blocked")
                console.log("schema blocked");
                db.close();

            }
        } else {
            res.status(400).json("not an admin");
            db.close();
        }
    });

}

module.exports = setToranutNextMonth;