const jwt = require("jsonwebtoken");

function getPiorityByUser(url, MongoClient, req, res) {


   // console.log("get piorirty" , req.body);
   // console.log("data",req.body);
    var userid = req.body.userid;
    var haadfotPiorty = req.body.piority[0]; 
    var userPiorty = req.body.piority[1];
    var userArray =[];
    const isEquel = (element) => element == userid;
    var index = userPiorty.findIndex(isEquel);
   // console.log("index",index);
 //   var yhas = 100 / 3;

    let haadafotUser = [];
 MongoClient.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, db) {
      if (err) throw err;
      var dbo = db.db("newmaindb");
      dbo
        .collection("haadafottest")
        .find({ userid })
        .toArray(function (err, resultHaadafot) {
            resultHaadafot.forEach(el => {
            let date1 = new Date(el.begindate)
            let date2 = new Date(el.enddate)
            var startDay = date1.getDate()
            var endDay = date2.getDate();
            for(var i=startDay;i<=endDay-1;i++) {
                haadafotUser.push(i);
                if( i == endDay-1) {
                    db.close();
                }
            }
            });
          
        });
    }
  );


    var prectange = ((index+1) / userPiorty.length)*100;
    var totalSize = haadfotPiorty.length;

    if(prectange >=0 && prectange <= 34) {
        userArray = haadfotPiorty.slice(0,(totalSize/3) - 1);
    }
   else if(prectange > 34 && prectange <= 68) {
        userArray = haadfotPiorty.slice(totalSize/3,(totalSize/3*2)-1);
    }
    else {
        userArray = haadfotPiorty.slice((totalSize/3)*2,totalSize-1);
    }
    for(var i=0;i<haadafotUser.length;i++) {
        var index = newCounter.indexOf(haadafotUser[i]);
        if (index !== -1) newCounter.splice(index, 1);
    }


    //console.log("userArray",userArray);
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
