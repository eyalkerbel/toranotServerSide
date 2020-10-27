const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');


function getDataForInitRedux(url,MongoClient,req,res,db) {
    var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt");
      return;
    }
    console.log(verified);
    //console.log(err);
      var obi = verified.payload;
      var _id = obi._id;
      const {permissionlvl} = verified.payload;
     // console.log("userid hadd",_id);
      // MongoClient.connect(
      //   url,
      //   {
      //     useNewUrlParser: true,
      //     useUnifiedTopology: true
      //   },
      //   function (err, db) {
      //     if (err) throw err;
          var dbo = db.db("newmaindb");
          const promise1 = new Promise(resolve =>  dbo.collection("users").findOne({"_id": ObjectId(_id)}).then(result => resolve(result)));
          const promise2 =  dbo.collection("users").find({}).toArray();
          const promise3 = dbo.collection("toranots").aggregate([{$lookup:  {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "userDetails"
        }}, {$unwind: "$userDetails"},{$match: {"monthTab": 0}}]).toArray();
        const promise4 = dbo.collection("toranots").aggregate([{$lookup:  {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "userDetails"
        }}, {$unwind: "$userDetails"},{$match: {"monthTab": 1}}]).toArray();

           const promise5 = returnNotificationByValue(dbo,_id,permissionlvl);
          const promise6 =  dbo.collection("toranim").aggregate([{$lookup:  {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "userDetails"
        }}, {$unwind: "$userDetails"},{$match: {"monthTab": 0}}]).toArray(); 
         const promise7 =  dbo.collection("toranim").aggregate([{$lookup:  {
                from: "users",
                localField: "idUser",
                foreignField: "_id",
                as: "userDetails"
            }}, {$unwind: "$userDetails"},{$match: {"monthTab": 1}}]).toArray();  
            const promise8 = dbo.collection("haadafottest").find({ idUser:ObjectId(_id)}).toArray();
            const promsie9 = dbo.collection("haadafottest").find().toArray();
           // console.log("saas");
          Promise.all([promise1,promise2,promise3,promise4,promise5,promise6,promise7,promise8,promsie9]).then(values => {
           //  console.log("values" , values)
            res.status(200).json(values);
          //  db.close();
          });
        });
  //  });
}
function returnNotificationByValue(dbo,idUser,permissionlvl) {
  if(permissionlvl == "admin") {
   return dbo.collection("notificationsManager").find({}).toArray();
  } else {
    return dbo.collection("notifications").aggregate([
      { $lookup:  {
          from: "toranots",
          localField: "toranotId",
          foreignField: "_id",
          as: "toranot" 
        }}, { $unwind: {
          path: "$toranot",
          preserveNullAndEmptyArrays: true
        }}, {$match:{
          $and:[{"toranot.idUser" : ObjectId(idUser)}]
      } },
      { $lookup:  {
        from: "users",
        localField: "friendId",
        foreignField: "_id",
        as: "userDetails" 
      }}, { $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true
      }}
    ]).toArray();
  }}

module.exports = getDataForInitRedux;