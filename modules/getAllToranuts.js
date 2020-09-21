const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

function getAllToranuts(url, MongoClient, req, res) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified);
        console.log(err)

        var obi = verified.payload;
        var userid = obi.userid;
        var idUser = obi._id;
        var currentDate = new Date();
        var currentMonth = currentDate.getMonth();
        var nextMonth = currentMonth+1;
        var tempAllThisMonth =[];
        var tempMyThisMonth = [];
        var tempThisMonth = [];
        var tempAllNextMonth = [];
        var tempMyNextMonth =[];
        var tempNextMonth = [];




        MongoClient.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (err, db) {
                if (err) throw err;
                var sendable = [[] , []];
                var dbo = db.db("newmaindb");
                const thisMonthAllPromise = GetDBCollectionAllUsers(dbo,"toranutsthismonth",currentMonth,[]);
                const thisMonthMyPromise = GetDBCollectionMine(dbo,"toranutsthismonth",currentMonth,idUser);
                const nextMonthAllPromise = GetDBCollectionAllUsers(dbo,"toranutsnextmonth",nextMonth,[]);
                const nextMonthMyPromise = GetDBCollectionMine(dbo,"toranutsnextmonth",nextMonth,idUser);
                Promise.all([thisMonthAllPromise,thisMonthMyPromise,nextMonthAllPromise,nextMonthMyPromise]).then(value => {
                 console.log("values" , value);
                  sendable[0].push(value[0]);
                  sendable[0].push(value[1]);
                  sendable[1].push(value[2]);
                  sendable[1].push(value[3]);
                  res.json(sendable);
                  db.close();
                });
                // dbo.collection("toranutsthismonth")
                //     .find({})
                //     .toArray(function (err, result) {
                //         if (result.length === 0) {
                //             console.log("lookup failed 0 0");
                //         } else {
                //             for(var i=0;i<result.length;i++) {
                //                 var newDate = new Date(result[i].date);
                //                 // console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
                //                if(currentMonth == newDate.getMonth()) {
                //                 tempAllThisMonth.push(result[i]);
                //                }
                //               }
                //         }
                //         sendable[0].push(tempAllThisMonth);
                //         console.log("succsedd 0 0 ");


                //     });
                //     dbo
                //     .collection("toranutsthismonth")
                //     .find({userid:userid })
                //     .toArray(function (err, result) {
                //       if (result.length === 0) {
                //         console.log("lookup failed 0 1");
                //        // res.status(400).json([])
                //       } else {
                //         for(var i=0;i<result.length;i++) {
                //           var newDate = new Date(result[i].date);
                //          if(currentMonth == newDate.getMonth()) {
                //             tempMyThisMonth.push(result[i]);
                //          }
                //         }
                       
                //       }
                //       sendable[0].push(tempMyThisMonth);
                //       console.log("succsedd 0 1 ");
                //     });
                //     console.log("tempthismonth" , tempThisMonth);

                
                // dbo.collection("toranutsnextmonth")
                //     .find({})
                //     .toArray(function (err, result) {
                //     //    console.log("resnex" , result);
                //         if (result.length === 0) {
                //             console.log("lookup failed 1 0");
                //             //res.json(sendable)
                //             sendable[1].push([]);
                //         } else {
                //             console.log("res" , result);
                //             for(var i=0;i<result.length;i++) {
                //                 var newDate = new Date(result[i].date);
                //                if(nextMonth == newDate.getMonth()) {
                //                 //  console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
                //                 tempAllNextMonth.push(result[i]);
                //                }
                //               }
                //               sendable[1].push(tempAllNextMonth);
                //               console.log("succseed 1 0");

                //             //console.log("sensable" ,sendable)
                //           //  res.json(sendable)
                //         }
                //     });
                //     dbo
                //     .collection("toranutsnextmonth")
                //     .find({userid:userid})
                //     .toArray(function (err, result) {
                //       if (result.length === 0) {
                //         console.log("lookup failed walla");
                //         sendable[1].push([]);
                //       } else {
                //         for(var i=0;i<result.length;i++) {
                //           var newDate = new Date(result[i].date);
                //          if(nextMonth == newDate.getMonth()) {
                //             tempMyNextMonth.push(result[i]);
                //          }
                //         }
                //         console.log("tempMyNextMonth" ,tempMyNextMonth)
                //         sendable[1].push(tempMyNextMonth);
                //         console.log("sendavle" ,  sendable[0]  , sendable[1]);
                //       }
                //       console.log("finsih getall")
                //       res.json(sendable);
                //       db.close();
                //     });


            }
        );
    });
}


function GetDBCollectionAllUsers(dbo,collectionName,Month,tempAllThisMonth) {
 
return new Promise(resolve => dbo.collection(collectionName).find({}).toArray(function(err,result) {
   console.log("result" , result);
  for(var i=0;i<result.length;i++) {
    var newDate = new Date(result[i].date);
    // console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
   if(Month == newDate.getMonth()) {
    tempAllThisMonth.push(result[i]);
   }
  }
  resolve(tempAllThisMonth);

}));
}


function GetDBCollectionMine(dbo,collectionName,Month,idUser) {
   tempMyThisMonth = [];
  // console.log("id is" , idUser);
return new Promise(resolve => dbo.collection(collectionName).find({"userDetails._id": new ObjectId(idUser)}).toArray(function(err,result) {
  console.log("result mine", result);
  for(var i=0;i<result.length;i++) {
    var newDate = new Date(result[i].date);
    // console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
   if(Month == newDate.getMonth()) {
    tempMyThisMonth.push(result[i]);
   }
  }
  resolve(tempMyThisMonth);

}));

}

module.exports = getAllToranuts;
