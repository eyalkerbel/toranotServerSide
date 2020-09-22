const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { ObjectId } = require('mongodb');
const { Console } = require('console');
const { resolve } = require('path');
const getToranotItemForFronted = require("./MongoEzer/getToranotItemForFronted");

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
      //  console.log("req body" , data);
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
                    //   console.log("values" , value[0] , "1" , value[1] , "2" ,value[2]);
                        res.json(value);
                        db.close();
                    });
                }
            )
    });

}

function returnDBPromisetoranot(dbo,nameCollection) {
    var temp = [];
     return new Promise(resolve => dbo.collection(nameCollection).find({}).toArray().then(async elements => {
                     temp = await getToranotItemForFronted(dbo,elements);              
                        console.log("finsihforeach",temp);
                         resolve(temp);
                      
                    }));
                }

function returnDBPromise(dbo,nameCollection) {
    return new Promise(resolve =>dbo.collection(nameCollection).find({}).toArray(function (err, result) {
         resolve(result);
}));
}


module.exports = getUsersAndToranuts;