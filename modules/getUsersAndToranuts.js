const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { Console } = require('console');
const { resolve } = require('path');


function getUsersAndToranuts(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        var obi = verified.payload;
        var permissionlvl = obi.permissionlvl;
        var data = req.body;
        console.log("req body" , data);
        // if (permissionlvl === "admin") {
            MongoClient.connect(
                url,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("newmaindb");
                    var sendable = [];
                    const toranimThisMonthPromise = returnDBPromise(dbo, "toranimThisMonth");
                    const toranimNextMonthPromise = returnDBPromise(dbo,"toranimNextMonth");
                    const toranutsthismonthPromise = returnDBPromisetoranot(dbo,"toranutsthismonth");
                    const toranutsnextmonthPromise = returnDBPromisetoranot(dbo, "toranutsnextmonth");
                    Promise.all([toranimThisMonthPromise,toranimNextMonthPromise,toranutsthismonthPromise,toranutsnextmonthPromise]).then(value => {
                    //  console.log("values" , value[0] , "1" , value[1] , 2 ,value[2]);
                        res.json(value);
                        db.close();
                    });


                    // dbo.collection("toranutsthismonth").find({}).toArray().then(async elements => {
                    //  for(const element of elements) {
                    //         var _id = element.idUser;
                    //     console.log("foreach id" , _id);
                    //     const userDetails = await getDetails(dbo,_id);
                    //     console.log("userDetails" , userDetails);
                    //  }                        
                    //     console.log("finsihforeach");
                      
                    // });
                    //  dbo.collection("toranimThisMonth").find({}).toArray(function (err, result) {
                    //         if (result.length === 0) {
                    //             console.log("lookup failed");
                    //             sendable.push(result)
                    //         } else {
                    //             sendable.push(result)
                    //         }
                    //     })

                    //     dbo.collection("toranimNextMonth").find({}).toArray(function (err, result) {
                    //             if (result.length === 0) {
                    //                 console.log("lookup failed");
                    //                 sendable.push(result)
                    //             } else {
                    //                 sendable.push(result)
                    //             }
                    //         });
                            
                    // dbo.collection("toranutsthismonth")
                    //     .find({})
                    //     .toArray(function (err, result) {
                    //         if (result.length === 0) {
                    //             console.log("lookup failed");
                    //             sendable.push(result);
                    //         } else {
                    //             sendable.push(result);
                    //         }
                    //     });
                        
                    // dbo.collection("toranutsnextmonth")
                    //     .find({})
                    //     .toArray(function (err, result) {
                    //         if (result.length === 0) {
                    //             sendable.push(result);
                    //             console.log("lookup failed");
                    //             res.json(sendable);
                    //             console.log("sendablefinal" , sendable);
                    //             db.close();
                    //         } else {
                    //             sendable.push(result);
                    //             console.log("sendablefinal" , sendable);
                    //             res.json(sendable);
                    //             db.close();

                    //         }
                    //     });
                }
            )
    });

}

function returnDBPromisetoranot(dbo,nameCollection) {
    var temp = [];
     return new Promise(resolve => dbo.collection(nameCollection).find({}).toArray().then(async elements => {
                    //  for(const element of elements) {
                    //       //  var _id = element.idUser;
                    //     console.log("foreach id" , _id);
                        
                    //   //  const userDetails = await getDetails(dbo,_id);
                    //     if(userDetails != null) {
                    //     console.log("userDetails" , userDetails);
                    //     var tempi = {
                    //         date: element.date,
                    //         toran : element.toran,
                    //         userDetails : elemntuserDetails
                    //         // name: userDetails.name,
                    //         // userid: userDetails.userid,
                    //         // type: userDetails.type,
                    //         // points: userDetails.points,
                    //     }
                    //     temp.push(tempi)
                    //  }
                    // }                     
                     //   console.log("finsihforeach",temp);
                         resolve(elements);
                      
                    }));
                }

function returnDBPromise(dbo,nameCollection) {
    return new Promise(resolve =>dbo.collection(nameCollection).find({}).toArray(function (err, result) {
         resolve(result);
}));
}




function getDetails(dbo,idUser) {

    return new Promise(resolve => dbo.collection("users").findOne({"_id":ObjectId(idUser)},function(err,element) {
        console.log("err" , err);
        console.log("element" , element);

            resolve(element);
    })
    );

  
}

module.exports = getUsersAndToranuts;