const jwt = require("jsonwebtoken");
const { send } = require("process");
const { resolve } = require("path");
const {ObjectId} = require("mongodb");
const getToranotItemForFronted = require("./MongoEzer/getToranotItemForFronted");
function getExchangesAndTornot(url,MongoClient,req,res) {
    console.log("getExchangesAndTornot server");
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
    //    console.log(verified);
      //  console.log(err)

        var obi = verified.payload;
        var userid = obi.userid;
        var idUser = obi._id;
        console.log("idUser" , idUser);
        MongoClient.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (err, db) {
                if (err) throw err;
                var sendable = [];
                var dbo = db.db("newmaindb");
                // const promise = new Promise(resolve => dbo.collection("toranotexchanges").updateMany({'newDate.userid':userid},{"$set":{"seen": true}})).then(() =>{
                //     console.log("finish 0");
                //      resolve(true);
                // });
                const promise =  dbo.collection("toranotexchanges").updateMany({'newDate.userid':userid},{"$set":{"seen": true}});
                // const promise1 = new Promise(resolve => dbo.collection("toranutsthismonth").find({"idUser": new ObjectId(idUser)}).toArray().then(async result => {
                //     var temp = await getToranotItemForFronted(dbo,result);
                //      resolve(temp);
                // }));

                const promise1 = new Promise(resolve => dbo.collection("toranutsthismonth").find({"idUser": new ObjectId(idUser)}).toArray().then(result=> getToranotItemForFronted(dbo,result)).then(res => resolve(res)));
                const promise2 = new Promise(resolve => dbo.collection("toranutsnextmonth").find({"idUser": new ObjectId(idUser)}).toArray().then(async result => {
                    var temp = await getToranotItemForFronted(dbo,result);
                    resolve(temp);                
                }));
                const promise3 = new Promise(resolve => dbo.collection("toranotexchanges").find({'oldDate.userid':userid}).toArray().then(result => resolve(result)));
                const promise4 = new Promise(resolve => dbo.collection("toranotexchanges").find({'newDate.userid':userid}).toArray().then(result => resolve(result)))
                const promise5 = new Promise(resolve =>  dbo.collection("toranotexchanges").find({'newDate.userid':userid, status:{ "$nin": ["asking" , "reject"]}}).toArray().then((result => resolve(result))));
               Promise.all([promise,promise1,promise2,promise3,promise4,promise5]).then(values => {
                //    console.log("values" , values[1] , "1" , values[2]  ,"2", values[3] , "3" ,values[4] , "4" , values[5]);
                console.log("0" , values[1] ,"1", values[2]);
                   sendable.push(values[1]);
                   sendable.push(values[2]);
                   sendable.push(values[3]);
                   sendable.push(values[4]);
                   sendable.push(values[5]);
                   res.json(sendable);
                   db.close();
               })
            //     dbo.collection("toranutsnextmonth")
            //     .find({userid:userid})
            //     .toArray(function (err, result) {
            //         if(result == []) {
            //             sendable.push([null]);
            //         } else {
            //         sendable.push(result);
            //         }
            //     });
            //     dbo.collection("toranotexchanges").find({'oldDate.userid':userid}).toArray(function (err, result) {
            //         console.log("resultmine" ,  result);
            //         //console.log("exchanges id", result);
            //         if(result == []) {
            //             sendable.push([null]);
            //         } else {
            //         sendable.push(result);
            //         }
            //     });

               

            //     dbo.collection("toranotexchanges").find({'newDate.userid':userid}).toArray(function (err, result) {
            //       //  console.log("exchanges id", result);
            //         if(err) {
            //             console.log("error");
            //             sendable.push([null]);
            //             // res.json(sendable)
            //         } else {
            //             sendable.push(result);
            //             // res.json(sendable)
            //         }
            //     });
            //     dbo.collection("toranotexchanges").find({'newDate.userid':userid, status:{ "$nin": ["asking" , "reject"]}}).toArray(function (err, result) {
            //         //  console.log("exchanges id", result);
            //           if(result == []) {
            //               console.log("error");
            //               sendable.push([]);
            //               console.log("sendable", sendable);
            //             res.json(sendable);
            //             db.close();
            //           } else {
            //               sendable.push(result);
            //               console.log("sendable", sendable);
            //               res.json(sendable);
            //               db.close();
            //           }
                      
            //       });


             });
});
}


module.exports = getExchangesAndTornot;