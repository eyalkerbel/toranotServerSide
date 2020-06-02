const jwt = require("jsonwebtoken");
const Joi = require("joi");

function checkUser(url, MongoClient, req, res) {
  //console.log("Check",req.headers);
  const data = req.body;
  console.log("checkuserStarting",data);
  const schema = Joi.object().keys({
    username: Joi.string()
      .min(3)
      .max(30)
      .required(),
    password: Joi.string()
      .min(3)
      .max(30)
      .required()
  });
  const ValidOrNot = Joi.validate(data, schema);
  if (ValidOrNot.error === null) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username,password);
        MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        console.log("dbo")
        var dbo = db.db("toranot")
        console.log(username);
        dbo.collection("users").find({sn:username}).toArray(function (err, result) {
            console.log(result);
            if (result.length === 0) {
              console.log("login failed");
              res.status(400).send("None shall pass");
            } else {
              if (result[0].password === password) {
                var permissionlvl = result[0].permissionlvl;
                console.log("login successful");
                jwt.sign(
                  { payload: result[0] },
                  "iamthesecretkey",
                  (err, token) => {
                    var newpayload = {
                      token: token,
                      permissionlvl: permissionlvl
                    };
                    res.status(200).json({ newpayload });
                  }
                );
              } else {
                res.status(400).json("wrong password");
              }
            }
            db.close();
          });
      }
    );
  } else {
    res.status(400).json("invalid schema")
  }
}

module.exports = checkUser;
