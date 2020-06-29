const jwt = require("jsonwebtoken");

function getPiorityByUser(url, MongoClient, req, res) {
    console.log("data",req.body);
    var userid = req.body.userid.userid;
    var haadfotPiorty = req.body.piority[0]; 
    var userPiorty = req.body.piority[1];
    var userArray =[];
    const isEquel = (element) => element == userid;
    var index = userPiorty.findIndex(isEquel);
    console.log("index",index);
 //   var yhas = 100 / 3;


    var prectange = ((index+1) / userPiorty.length)*100;
    if(prectange >=0 && prectange <= 34) {
        userArray = haadfotPiorty.slice(1,10);
    }
   else if(prectange > 34 && prectange <= 68) {
        userArray = haadfotPiorty.slice(11,21);
    }
    else {
        userArray = haadfotPiorty.slice(21,31);
    }
    console.log("userArray",userArray);
    res.send(userArray);



//   var BearerHeader = req.headers["authorization"];
//   var splitted = BearerHeader.split(" ");
//   jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
//     if (err !== null) {
//       res.status(400).json("invalid jwt");
//       return;
//     }
//     console.log(verified);
//     console.log(err);

//     var obi = verified.payload;
//     var userid = obi.userid;
//     MongoClient.connect(
//       url,
//       { useNewUrlParser: true, useUnifiedTopology: true },
//       function (err, db) {
//         if (err) throw err;
//         var dbo = db.db("newmaindb");
//         dbo
//           .collection("toranutsnextmonth")
//           .find({ userid })
//           .toArray(function (err, result) {
//             if (result.length === 0) {
//               console.log("lookup failed");
//               res.status(400).json([]);
//             } else {
//             //  res.json(result);
//               db.close();
//             }
//           });
//       }
//     );
//   });
}

module.exports = getPiorityByUser;
