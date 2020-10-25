const jwt = require("jsonwebtoken");
const Joi = require("joi");
const {ObjectId} = require("mongodb");
const addNewNotification = require("../Notifications/addNewNotification");
function addTotanotChange(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log("verfid" , verified);
      var obi = verified.payload;
      if(obi.userid != null) {
        var userid = obi.userid;
      } else {
        var userid = obi.sn;
      }
      var name = obi.name;
      console.log("userid hadd",req.body);
      // console.log("req.body" , req.body);
      var data = req.body;
    
   // console.log("send message beckend",names)
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
         async function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          console.log("req body" , req.body);
          // var noti = {
          //   myId: ObjectId(req.body.toranotIdNew),
          //   friendId: await GetIdPersonByToranotId(req.body.toranotIdOld),
          //   seen: false,
          //   action: "wantExchange"
          // };


          // var newData = {
          //   toranotIdOld: ObjectId(data.toranotIdOld),
          //   toranotIdNew: ObjectId(data.toranotIdNew),
          //   status: data.status,
          //   oldMessage: data.oldMessage,
          //   seen: data.seen
          // }
          data["toranotIdNew"] = ObjectId(data.toranotIdNew);
         data["toranotIdOld"] = ObjectId(data.toranotIdOld);
       //   await insertData(data);
          console.log("data" , data);
       //   const promise1 = dbo.collection("notifications").insert(noti);

          var freindId = await GetIdPersonByToranotId(dbo,req.body.toranotIdOld);
         var userId = await GetIdPersonByToranotId(dbo,req.body.toranotIdNew);
          const promise1 = addNewNotification(dbo,ObjectId(req.body.toranotIdNew),userId,freindId,"wantExchange");
         //const promise1 = addNewNotification(dbo,userd,freindId,ObjectId(req.body.toranotIdNew),"wantExchange")
          const promsie2 = dbo.collection("toranotexchanges").insert(data);
          Promise.all([promise1,promsie2]).then(values => {
                res.status(200).json("succeed");
                db.close();
          });

        //  dbo.collection("toranotexchanges").insert(data).then(() => {
        //     res.status(200).json("succeed");
        //     db.close();
        //   });
   
});
});
}
function GetIdPersonByToranotId(dbo,toranotId) {
  return new Promise((resolve) => dbo.collection("toranots").findOne({"_id": ObjectId(toranotId)}).then(element => resolve(element.idUser)));
}

function insertData(data) {
  data["toranotIdOld"] = ObjectId(data.toranotIdOld);
  data["toranotIdNew"] = ObjectId(data.toranotIdNew);
  console.log("finishInsert" , data);
  return data;
}

module.exports = addTotanotChange;