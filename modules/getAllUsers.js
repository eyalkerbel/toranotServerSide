// const { array } = require("joi");
const jwt = require('jsonwebtoken');

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
            console.log("allusers" , allUsers , err);
        dbo.collection("toranimThisMonth").find({}).toArray(function(err,usersMonth){
            var thisMonthTemp = [[]];
            var thisMonthNot = [];
            console.log("userMonth" ,usersMonth.length);
            if( usersMonth.length != 0) {
                    console.log("no-extreme");
                for(var i=0;i<allUsers.length;i++) {
                
                    console.log("index" , usersMonth.indexOf(allUsers[i])) //Todo: fix this issue

                    var isEqual = false;
                    for(var j=0;j<usersMonth.length;j++) {
                        console.log(usersMonth[j]._id , " ," , allUsers[i]._id);
                        if(usersMonth[j]._id == allUsers[i]._id) {
                            isEqual = true;
                        }
                    }
                if(isEqual == false) {
                    thisMonthNot.push(allUsers[i]);
                }
                }
             } else {
                    console.log("extreme");
                    thisMonthNot = allUsers;
                    usersMonth = [];
                
            }
            console.log("usersMonth" , usersMonth);
                thisMonthTemp[0] = usersMonth;
                thisMonthTemp[1] = thisMonthNot;
                allTemp[0] = thisMonthTemp;
                console.log("finish thismonth" , thisMonthTemp[0] , ", x " , thisMonthTemp[1]  );
        });
        dbo.collection("toranimNextMonth").find({}).toArray(function(err,usersNextMonth){
            var nextMonthTemp = [[]];
            var nextMonthNot = [];
            console.log("userNextMonth" , usersNextMonth);
            if( usersNextMonth.length != 0) {
            for(var i=0;i<allUsers.length;i++) {
                var isEqual = false;

                for(var j=0;j<usersNextMonth.length;j++) {
                    console.log(usersNextMonth[j]._id , " ," , allUsers[i]._id);
                    if(usersNextMonth[j]._id == allUsers[i]._id) {
                        isEqual = true;
                    }
                }
                if(isEqual == false) {
                    nextMonthNot.push(allUsers[i]);
                     }
            }
             } else {
                    nextMonthNot = allUsers;
                    usersNextMonth = [];
                }
            
                nextMonthTemp[0] = usersNextMonth;
                nextMonthTemp[1] = nextMonthNot;
                allTemp[1] = nextMonthTemp;
                console.log("get all users finsih" , allTemp);
                res.json(allTemp);
                db.close();
        });
       
        });
        
      
      });
    
});
}

module.exports = getAllUsers;