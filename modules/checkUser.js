const jwt = require("jsonwebtoken");
const Joi = require("joi");

function checkUser(url, MongoClient, req, res,db) {
  //console.log("Check",req.headers);
  const data = req.body;
  console.log("checkuserStarting",data);
  // const schema = Joi.object().keys({
  //   username: Joi.string()
  //     .min(3)
  //     .max(30)
  //     .required(),
  //   password: Joi.string()
  //     .min(3)
  //     .max(30)
  //     .required()
  // });
  // const ValidOrNot = Joi.validate(data, schema);
  // if (ValidOrNot.error === null) {
    console.log("succseed");
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
      //   MongoClient.connect(
      // url,
      // { useNewUrlParser: true, useUnifiedTopology: true },
      // function (err, db) {
      //   if (err) throw err;
      //   console.log("dbo")
        var dbo = db.db("newmaindb");
        dbo.collection("users").find({$or:[ {'userid':username}, {'sn':username}]}).toArray(function (err, result) {
            if (result.length === 0) {
              console.log("login failed");
              res.status(400).send("None shall pass");
            }
            else  {
              console.log("result" , result[0]);
              if (result[0].password === password) {
                var permissionlvl = result[0].permissionlvl;
                console.log("login successful",permissionlvl);
                jwt.sign(
                  { payload: result[0] },
                  "iamthesecretkey",
                  (err, token) => {
                    var newpayload = {
                      token: token,
                      permissionlvl: permissionlvl
                    };
                    const details = {
                      name: result[0].name,
                      sn: result[0].sn,
                      password: result[0].password,
                      password2: result[0].password2
                    }
                    console.log("newpayload",newpayload)
                    res.status(200).json({ newpayload,details });
                  }
                );
              } else {
                res.status(400).json("wrong password");
              }
            }
         //   db.close();
      //     });
       }
    );
  // } else {
  //   res.status(400).json("invalid schema")
  // }
}

module.exports = checkUser;
