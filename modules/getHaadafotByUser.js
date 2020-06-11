const jwt = require("jsonwebtoken");


function getHaadafotByUser(url, MongoClient, req, res) {
    var userid = req.body.userid;
    console.log("userid",userid);
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          dbo
            .collection("haadafottest")
            .find({
              userid:userid
            })
            .toArray(function (err, result) {
              if (result.length === 0) {
                console.log("lookup failed");
                res.status(200).send(result);
              } else {
                     console.log("good");
                res.status(200).json(result);
                db.close();
              }
            });


});
}
module.exports = getHaadafotByUser;