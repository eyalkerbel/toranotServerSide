const { ObjectId } = require("mongodb");
const jwt = require('jsonwebtoken');
function deleteNotificationById(req,res,db) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log("req.body" , req.body);
      const {_id} = req.body
      var dbo = db.db("newmaindb");
      dbo.collection("notifications").deleteOne({"_id": ObjectId(_id)});
      res.status(200).json("succsess");
    });
}

module.exports = deleteNotificationById;