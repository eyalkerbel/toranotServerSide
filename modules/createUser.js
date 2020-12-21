const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

function createUser(url, MongoClient, req, res, db) {
    var data = req.body;
    console.log("data", data);
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified, "kjsaj");
        var obi = verified.payload;
        var permissionlvl = "admin";
        console.log(permissionlvl);
        if (permissionlvl === "admin") {
            console.log("data", data);
            var dbo = db.db("newmaindb");
            console.log("succsedd");
            data["type"] = ObjectId(data.type);
            dbo.collection("users").insertOne(data).then((element) => res.json(element.ops[0]));
        } else {
            res.status(400).json("not an admin");
        }
    });

}

module.exports = createUser;