const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { ObjectId } = require('mongodb');

function createUser(url, MongoClient, req, res,db) {
    var data = req.body;
    console.log("data",data);
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified,"kjsaj");
        var obi = verified.payload;
        var permissionlvl = "admin";
        console.log(permissionlvl);
   //     var data = req.body;
        // var newData = {
        //     name: req.body.name,
        //     sn: req.body.userid,
        //     password: req.body.password,
        //     password2: req.body.password2,
        //     selectedType: req.body.type,
        //     permissionlvl: req.body.permissionlvl
        // };

        if (permissionlvl === "admin") {
            // const schema = Joi.object().keys({
            //     name: Joi.string().min(3).max(30).required(),
            //     password: Joi.string().min(3).max(30).required(),
            //     name: Joi.string().min(3).max(30).required(),
            //     userid: Joi.string().min(3).max(30).required(),
            //     permissionlvl: Joi.string().min(3).max(10).required()
            // });
            console.log("data",data);
           // console.log(schema);
          //const ValidOrNot = Joi.validate(data, schema);
          //  console.log(ValidOrNot);
          //  if (ValidOrNot.error === null) {
            //   if(true) {
            //     MongoClient.connect(
            //         url,
            //         {
            //             useNewUrlParser: true,
            //             useUnifiedTopology: true
            //         },
            //         function (err, db) {
            //             if (err) throw err;
                        var dbo = db.db("newmaindb");
                     console.log("succsedd");
                     data["type"] = ObjectId(data.type);
                     dbo.collection("users").insertOne(data).then(() =>   res.status(200).json("success"));
                     //     });
                       // db.close();
                      
                // );
            // } else {
            //     res.status(400).json("schema blocked")
            //     console.log("schema blocked")
            // }
        } else {
            res.status(400).json("not an admin");
        }
    });

 }

module.exports = createUser;