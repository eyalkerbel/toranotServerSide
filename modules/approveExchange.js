const jwt = require("jsonwebtoken");
const Joi = require("joi");

function approveExchange(url,MongoClient,req,res) {
//     var BearerHeader = req.headers["authorization"];
//     var splitted = BearerHeader.split(" ");
//     jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
//       if (err !== null) {
//         res.status(400).json("invalid jwt")
//         return;
//       }
//       console.log("verfid" , verified);
//       var obi = verified.payload;
//       if(obi.userid != null) {
//         var userid = obi.userid;
//       } else {
//         var userid = obi.sn;
//       }
//       var name = obi.name;
//       console.log("userid hadd",req.body);


//    // console.log("send message beckend",names)
//     MongoClient.connect(
//         url,
//         {
//           useNewUrlParser: true,
//           useUnifiedTopology: true
//         },
//          function (err, db) {
//           if (err) throw err;
//           var dbo = db.db("newmaindb");
//           var data = req.body;
//           console.log("data" , data.index );
//           var isApprove = data.isApprove;
//           var newDate = data.index.newDate;
//           var oldDate = data.index.oldDate;
//           console.log("date" , oldDate , "new" , newDate);
//         //   dbo.collection("exchanges").updateMany({"oldDate.date":date},{"status": "picking diffrent exchange"},{new: true },function(err, response) {
//             // dbo.collection("toranotexchanges").find({'newDate.dayOfWeek':newDate.dayOfWeek,'newDate.dayOfMonth':newDate.dayOfMonth}).toArray(function (err, result) {
//             //     console.log("result" , result);
//             // });
//             if(isApprove == true) {
//             dbo.collection("toranotexchanges").updateMany({'newDate.dayOfWeek':newDate.dayOfWeek,'newDate.dayOfMonth':newDate.dayOfMonth,'oldDate.dayOfWeek':oldDate.dayOfWeek,'oldDate.dayOfMonth':oldDate.dayOfMonth},{"$set":{"status": "agree"}},{},function(err, response) {
//             });
//          dbo.collection("toranotexchanges").updateMany({'newDate.dayOfWeek':newDate.dayOfWeek,'newDate.dayOfMonth':newDate.dayOfMonth, 'oldDate.dayOfMonth': { $ne: oldDate.dayOfMonth },'oldDate.dayOfWeek': { $ne: oldDate.dayOfWeek }},{"$set":{"status": "occupied"}},{},function(err, response) {
//           //   console.log("respone" , response);
//           db.close();  
//          });
//         } else {
//             dbo.collection("toranotexchanges").updateMany({'newDate.dayOfWeek':newDate.dayOfWeek,'newDate.dayOfMonth':newDate.dayOfMonth,'oldDate.dayOfWeek':oldDate.dayOfWeek,'oldDate.dayOfMonth':oldDate.dayOfMonth},{"$set":{"status": "reject"}},{},function(err, response) {
//                 //   console.log("respone" , response);
//                 db.close();  
//                });
//         }
         
// });
// });
}

module.exports = approveExchange;