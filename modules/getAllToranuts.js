const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
//const getToranotItemForFronted = require("./MongoEzer/getToranotItemForFronted");
const getToranotItemForFronted = require("./MongoEzer/getToranotItemForFronted");
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
                console.log("openMongoClient");
                dbo.collection("toranots").createIndex({idUser: 1});
                dbo.collection("toranots").createIndex({idUser: 1});

                const thisMonthAllPromise = GetDBCollectionAllUsers(dbo,0,[]);
                const thisMonthMyPromise = GetDBCollectionMine(dbo,0,idUser);
                const nextMonthAllPromise = GetDBCollectionAllUsers(dbo,1,[]);
                const nextMonthMyPromise = GetDBCollectionMine(dbo,1,idUser);
                Promise.all([thisMonthAllPromise,thisMonthMyPromise,nextMonthAllPromise,nextMonthMyPromise]).then(value => {
                //  console.log("values" , value);
                  sendable[0].push(value[0]);
                  sendable[0].push(value[1]);
                  sendable[1].push(value[2]);
                  sendable[1].push(value[3]);
                  res.json(sendable);
                  db.close();
                });
               


            }
        );
    });
}


function GetDBCollectionAllUsers(dbo,month,tempAllThisMonth) {
  console.log("ALLL");

return new Promise(resolve => dbo.collection("toranots").find({"monthTab": month}).toArray(async function(err,result) {
 
    console.log("find result");
    tempAllThisMonth = await getToranotItemForFronted(dbo,result);


console.log("finishALL");
resolve(tempAllThisMonth);


  //  console.log("result" , result);
  // for(var i=0;i<result.length;i++) {
  //   var newDate = new Date(result[i].date);
  //   // console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
  //  if(Month == newDate.getMonth()) {
  //   tempAllThisMonth.push(result[i]);
  //  }
  // }
  // resolve(tempAllThisMonth);

}));
}


function GetDBCollectionMine(dbo,month,idUser) {
   tempMyThisMonth = [];
   console.log("mineeesss",idUser);
  return new Promise(resolve => dbo.collection("toranots").find({"idUser": new ObjectId(idUser),"monthTab": month}).toArray(async function(err,result) {
  console.log("find resultmine");
  tempMyThisMonth = await getToranotItemForFronted(dbo,result);
  console.log("finish Mine");
  resolve(tempMyThisMonth);

}));

}

module.exports = getAllToranuts;
