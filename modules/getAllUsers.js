// const { array } = require("joi");
const jwt = require('jsonwebtoken');
const {ObjectId} = require("mongodb");
function getAllUsers(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt");
      return;
    }
    console.log(verified);
    console.log(err);

    var obi = verified.payload;
    var userid = obi.userid;
    MongoClient.connect(
      url,
      { useNewUrlParser: true, useUnifiedTopology: true },
      function (err, db) {
        if (err) throw err;
        var dbo = db.db("newmaindb");
        var allTemp = [[[]]];
        dbo.collection("users").find({}).toArray( function( err, allUsers){
//console.log("allusers" , allUsers , err);
    const promise1 =new Promise(resolve => dbo.collection("toranim").aggregate([
           {$lookup:  {
               from: "users",
               localField: "idUser",
               foreignField: "_id",
               as: "userDetails"
           }},
           {$unwind: "$userDetails"},
           {$match: {"monthTab": 0}} 
        ]).toArray().then(result => resolve(result)));


       // find({"monthTab":0}).toArray(function(err,usersMonth){
            // var thisMonthTemp = [[]];
            // var thisMonthNot = [];
            // console.log("userMonth" ,usersMonth.length);
            // if( usersMonth.length != 0) {
            //         console.log("no-extreme");
            //     for(var i=0;i<allUsers.length;i++) {
                
            //         console.log("index" , usersMonth.indexOf(allUsers[i])) //Todo: fix this issue

            //         var isEqual = false;
            //         for(var j=0;j<usersMonth.length;j++) {
            //             console.log(usersMonth[j]._id , " ," , allUsers[i]._id);
            //             if(usersMonth[j]._id == allUsers[i]._id) {
            //                 isEqual = true;
            //             }
            //         }
            //     if(isEqual == false) {
            //         thisMonthNot.push(allUsers[i]);
            //     }
            //     }
            //  } else {
            //         console.log("extreme");
            //         thisMonthNot = allUsers;
            //         usersMonth = [];
                
            // }
            // console.log("usersMonth" , usersMonth);
            //     thisMonthTemp[0] = usersMonth;
            //     thisMonthTemp[1] = thisMonthNot;
            //     allTemp[0] = thisMonthTemp;
            //     console.log("finish thismonth" , thisMonthTemp[0] , ", x " , thisMonthTemp[1]  );
      //  });
            const promise2= new Promise(resolve => dbo.collection("toranim").aggregate([
                {$lookup:  {
                    from: "users",
                    localField: "idUser",
                    foreignField: "_id",
                    as: "userDetails"
                }},
                {$unwind: "$userDetails"},
                {$match: {"monthTab": 1}} 
             ]).toArray().then(result => resolve(result)));

             Promise.all([promise1,promise2]).then(async values => {
            
                const thisMonth = new Promise(resolve => resolve(divideArrayByAlgo(values[0],allUsers,0)));
                const nextMonth = new Promise(resolve => resolve(divideArrayByAlgo(values[1],allUsers,1)));
                Promise.all([thisMonth,nextMonth]).then(values => {
                    console.log("thisMonth : " ,  values[0]);
                    console.log("nextMonth : " , values[1] );
                    res.json(values);
                    db.close();
                });
        
             });
      });
    
});
});
}

function divideArrayByAlgo(usersMonth,allUsers,monthTab) {
    var MonthTemp = [[]];
    var MonthNot = [];
    if( usersMonth.length != 0) {
        console.log("no-extreme" ,usersMonth);
    for(var i=0;i<allUsers.length;i++) {
        
        //console.log("index" , usersMonth.indexOf(allUsers[i])) //Todo: fix this issue
        var isEqual = false;
        for(var j=0;j<usersMonth.length;j++) {
            var monthId = usersMonth[j].userDetails._id.toString();
            var UserId = allUsers[i]._id.toString();

            if(monthId === UserId) {
                isEqual = true;
            }
        }
    if(isEqual == false) {
        var toranObjct={
            userDetails: allUsers[i],
            idUser: ObjectId(allUsers[i]._id),
            monthTab: monthTab
        }
        MonthNot.push(toranObjct);
    }
    }
 } else {
        console.log("extreme");
        for(var i=0;i<allUsers.length;i++) {
            var toranObjct={
                userDetails: allUsers[i],
                idUser: ObjectId(allUsers[i]._id),
                monthTab: monthTab
            }
            MonthNot.push(toranObjct);
        }
        usersMonth = [];
    
}
MonthTemp[0] = usersMonth;
MonthTemp[1] = MonthNot;
return MonthTemp;
}

module.exports = getAllUsers;