const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { Console } = require('console');
const { resolve } = require('path');
const getToranotItemForFronted = require("./MongoEzer/getToranotItemForFronted");

function getUsersAndToranuts(url, MongoClient, req, res,db) {
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
      //  console.log("req body" , data);
        // if (permissionlvl === "admin") {
            // MongoClient.connect(
            //     url,
            //     {
            //         useNewUrlParser: true,
            //         useUnifiedTopology: true
            //     },
            //     function (err, db) {
            //         if (err) throw err;
            //         var dbo = db.db("newmaindb");
                    var sendable = [];
                    const toranimThisMonthPromise = returnDBPromise(dbo,0);
                    const toranimNextMonthPromise = returnDBPromise(dbo,1);
                     const toranutsthismonthPromise = returnDBPromisetoranot(dbo, 0);
                     const toranutsnextmonthPromise = returnDBPromisetoranot(dbo, 1); //"toranutsnextmonth"
                    Promise.all([toranimThisMonthPromise,toranimNextMonthPromise,toranutsthismonthPromise,toranutsnextmonthPromise]).then(value => {
                        console.log("valuesss" , value[0] , "1" , value[1]);
                        res.json(value);
                      //  db.close();
                    });
                }
            )
    // });

}

function returnDBPromisetoranot(dbo,monthTab) {
    var temp = [];
    console.log("returnDBPromisetoranot");
     return new Promise(resolve => dbo.collection("toranots").find({"monthTab":monthTab}).toArray().then(async elements => {
                     temp = await getToranotItemForFronted(dbo,elements);              
                         resolve(temp);
                      
                    }));
}

function returnDBPromise(dbo,monthTab) {
    return new Promise(resolve => dbo.collection("toranim").aggregate([
        {$lookup:  {
            from: "users",
            localField: "idUser",
            foreignField: "_id",
            as: "userDetails"
        }},
        {$unwind: "$userDetails"},
        {$match: {"monthTab": monthTab}} 
     ]).toArray().then(elements =>  resolve(elements)));
}


module.exports = getUsersAndToranuts;