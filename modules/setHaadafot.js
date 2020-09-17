const jwt = require("jsonwebtoken");
const Joi = require('joi');
const { ObjectId } = require('mongodb');

function setHaadafot(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt")
      return;
    }
    console.log(verified);
    var obi = verified.payload;
    console.log("obi", obi );
    var userid = obi.userid;
    console.log(userid);
    var arriOfHaadafot = req.body;
    const schema = Joi.array()
    const ValidOrNot = Joi.validate(arriOfHaadafot, schema);
    console.log(ValidOrNot)
    if (ValidOrNot.error === null) {
      console.log("hadafot",arriOfHaadafot);
      arriOfHaadafot.forEach(element => {
        // element.userid = userid;
        element.idUser = ObjectId(obi._id);
      });
     console.log(arriOfHaadafot);
      

      MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          // dbo.collection("haadafottest").deleteMany({
          //   userid
          // });
          console.log("arriofHaadafot" , arriOfHaadafot);

          dbo.collection("haadafottest").insert(arriOfHaadafot).then(items => {
              res.status(200).json("challenge accepted");
              db.close();
            });
          
            
          // });
         

        });
    }
  });
}

module.exports = setHaadafot;
