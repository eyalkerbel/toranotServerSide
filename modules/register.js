const jwt = require('jsonwebtoken');
const Joi = require('joi');


function register(url, MongoClient, req, res) {
    var data = req.body;
    console.log(data);
    const schema = Joi.object().keys({
                    username: Joi.string().min(3).max(30).required(),
                    password: Joi.string().min(3).max(30).required(),
                    name: Joi.string().min(3).max(30).required(),
                    userid: Joi.string().min(3).max(30).required(),
                    permissionlvl: Joi.string().min(3).max(10).required()
                })
                const ValidOrNot = Joi.validate(data, schema);
   
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
         data.permissionlvl = "user";
console.log(data); 
//     if (ValidOrNot.error === null) {
    MongoClient.connect(
        url,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        function (err, db) {
            if (err) throw err;
            var dbo = db.db("newmaindb");
         console.log("succsedd");
         dbo.collection("users").insertOne(data);
            db.close();
            res.status(200).json("success");
        }
    );



//     jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
//        console.log("err",err);
//         if (err !== null) {
//             console.log("not good");
//             res.status(400).json("invalid jwt")
//             return;
//         }
//         console.log(verified);
//         var obi = verified.payload;
//         var permissionlvl;
//         console.log(req.body.password);
//         var permissionlvl = obi.permissionlvl;
//         if(req.body.password == "admin") {
//             permissionlvl = "admin";
//         } else {
//             permissionlvl = "user";
//         }
//         console.log(permissionlvl);
//         data.permissionlvl = permissionlvl;
//         if (permissionlvl === "admin") {
//             const schema = Joi.object().keys({
//                 username: Joi.string().min(3).max(30).required(),
//                 password: Joi.string().min(3).max(30).required(),
//                 name: Joi.string().min(3).max(30).required(),
//                 userid: Joi.string().min(3).max(30).required(),
//                 permissionlvl: Joi.string().min(3).max(10).required()
//             })
//             const ValidOrNot = Joi.validate(data, schema);
//             if (ValidOrNot.error === null) {
//                 MongoClient.connect(
//                     url,
//                     {
//                         useNewUrlParser: true,
//                         useUnifiedTopology: true
//                     },
//                     function (err, db) {
//                         if (err) throw err;
//                         var dbo = db.db("toranot");
//                      console.log("succsedd");
//                      dbo.collection("users").insertOne(data);
//                         db.close();
//                         res.status(200).json("success");
//                     }
//                 );
//             } else {
//                 res.status(400).json("schema blocked")
//                 console.log("schema blocked")
//             }
//         } else {
//             res.status(400).json("not an admin");
//         }
//     });

 }

module.exports = register;