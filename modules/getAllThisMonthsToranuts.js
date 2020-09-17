const jwt = require("jsonwebtoken");

function getAllThisMonthsToranuts(url, MongoClient, req, res) {
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
                dbo.collection("toranutsthismonth")
                    .find({})
                    .toArray(function (err, result) {
                        if (result.length === 0) {
                            console.log("lookup failed 0 0");
                        } else {
                            for(var i=0;i<result.length;i++) {
                                var newDate = new Date(result[i].date);
                                // console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
                               if(currentMonth == newDate.getMonth()) {
                                tempAllThisMonth.push(result[i]);
                               }
                              }
                        }
                        sendable[0].push(tempAllThisMonth);
                        console.log("succsedd 0 0 ");


                    });
                    dbo
                    .collection("toranutsthismonth")
                    .find({userid:userid })
                    .toArray(function (err, result) {
                      if (result.length === 0) {
                        console.log("lookup failed 0 1");
                       // res.status(400).json([])
                      } else {
                        for(var i=0;i<result.length;i++) {
                          var newDate = new Date(result[i].date);
                         if(currentMonth == newDate.getMonth()) {
                            tempMyThisMonth.push(result[i]);
                         }
                        }
                       
                      }
                      sendable[0].push(tempMyThisMonth);
                      console.log("succsedd 0 1 ");
                    });
                    console.log("tempthismonth" , tempThisMonth);

                
                dbo.collection("toranutsnextmonth")
                    .find({})
                    .toArray(function (err, result) {
                    //    console.log("resnex" , result);
                        if (result.length === 0) {
                            console.log("lookup failed 1 0");
                            //res.json(sendable)
                            sendable[1].push([]);
                        } else {
                            console.log("res" , result);
                            for(var i=0;i<result.length;i++) {
                                var newDate = new Date(result[i].date);
                               if(nextMonth == newDate.getMonth()) {
                                //  console.log("vs" , currentMonth , "  ,  " , newDate.getMonth())
                                tempAllNextMonth.push(result[i]);
                               }
                              }
                              sendable[1].push(tempAllNextMonth);
                              console.log("succseed 1 0");

                            //console.log("sensable" ,sendable)
                          //  res.json(sendable)
                        }
                    });
                    dbo
                    .collection("toranutsnextmonth")
                    .find({userid:userid})
                    .toArray(function (err, result) {
                      if (result.length === 0) {
                        console.log("lookup failed walla");
                        sendable[1].push([]);
                      } else {
                        for(var i=0;i<result.length;i++) {
                          var newDate = new Date(result[i].date);
                         if(nextMonth == newDate.getMonth()) {
                            tempMyNextMonth.push(result[i]);
                         }
                        }
                        console.log("tempMyNextMonth" ,tempMyNextMonth)
                        sendable[1].push(tempMyNextMonth);
                        console.log("sendavle" ,  sendable[0]  , sendable[1]);
                      }
                      console.log("finsih getall")
                      res.json(sendable);
                      db.close();
                    });


            }
        );
    });
}

module.exports = getAllThisMonthsToranuts;
