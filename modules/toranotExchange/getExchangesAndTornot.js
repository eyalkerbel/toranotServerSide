const jwt = require("jsonwebtoken");
const { send } = require("process");
const { resolve } = require("path");
const {ObjectId} = require("mongodb");
const getToranotItemForFronted = require("../MongoEzer/getToranotItemForFronted");
const deleteNotifications = require("../Notifications/deleteNotifications");
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
         const {indexDeleteNotifcation} = req.body;
        console.log("idUser" , idUser);
        MongoClient.connect(
            url,
            { useNewUrlParser: true, useUnifiedTopology: true },
            function (err, db) {
                if (err) throw err;
                var sendable = [];
                var dbo = db.db("newmaindb");
              
                
                const promise1 = new Promise(resolve => dbo.collection("toranots").find({"idUser": new ObjectId(idUser),"monthTab":0}).toArray().then(result=> getToranotItemForFronted(dbo,result)).then(res => resolve(res)));
                const promise2 = new Promise(resolve => dbo.collection("toranots").find({"idUser": new ObjectId(idUser),"monthTab":1}).toArray().then(async result => {
                    var temp = await getToranotItemForFronted(dbo,result);
                    resolve(temp);                
                }));
                // const promise3 = new Promise(resolve => dbo.collection("toranotexchanges").find({'oldDate.userid':userid}).toArray().then(result => resolve(result)));
                const promise3 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
                    { $lookup:
                       {
                         from: "toranots",
                         localField: "toranotIdOld",
                         foreignField: "_id",
                         as: "toranotOld"
                         }},{ $unwind: {
                        path: "$toranotOld",
                        preserveNullAndEmptyArrays: true
                      }},
                     { $lookup: {
                            from: "users",
                            localField: "toranotOld.idUser",
                            foreignField: "_id",
                            as: "toranotOld.userDetails"
                     }},{ $unwind: "$toranotOld.userDetails" },
                       {$match:{
                            $and:[{"toranotOld.userDetails._id" : ObjectId(idUser)}]
                        } },
                     { $lookup:{
                         from: "toranots",
                         localField: "toranotIdNew",
                         foreignField: "_id",
                         as: "toranotNew"
                        } }, {$unwind: "$toranotNew"},
                    { $lookup:{
                            from: "users",
                            localField: "toranotNew.idUser",
                            foreignField: "_id",
                            as: "toranotNew.userDetails"
                        }},  { $unwind: "$toranotNew.userDetails"},
                    ]).toArray().then(result => resolve(result)));

                // const promise4 = new Promise(resolve => dbo.collection("toranotexchanges").find({'newDate.userid':userid}).toArray().then(result => resolve(result)))
                   const promise4 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
                     { $lookup:
                        {
                         from: "toranots",
                         localField: "toranotIdNew",
                         foreignField: "_id",
                         as: "toranotNew"
                        }},{$unwind: "$toranotNew"},
                    { $lookup:
                        {
                            from: "users",
                            localField: "toranotNew.idUser",
                            foreignField: "_id",
                            as: "toranotNew.userDetails"
                        } },{$unwind: "$toranotNew.userDetails"},
                     {$match:{
                        $and:[{"toranotNew.userDetails._id" : ObjectId(idUser)}]    
                     }},
                     { $lookup:
                        {
                          from: "toranots",
                          localField: "toranotIdOld",
                          foreignField: "_id",
                          as: "toranotOld"
                        }},{ $unwind: {
                         path: "$toranotOld",
                         preserveNullAndEmptyArrays: true}},
                      { $lookup:
                         {
                             from: "users",
                             localField: "toranotOld.idUser",
                             foreignField: "_id",
                             as: "toranotOld.userDetails"
                         }
                      },{  $unwind: "$toranotOld.userDetails" }]).toArray().then(result => resolve(result)))

                    

              //  const promise5 = new Promise(resolve =>  dbo.collection("toranotexchanges").find({'newDate.userid':userid, status:{ "$nin": ["asking" , "reject"]}}).toArray().then((result => resolve(result))));
              const promise5 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
                { $lookup:
                   {
                    from: "toranots",
                    localField: "toranotIdNew",
                    foreignField: "_id",
                    as: "toranotNew"
                   }},{$unwind: "$toranotNew"},
               { $lookup:
                   {
                       from: "users",
                       localField: "toranotNew.idUser",
                       foreignField: "_id",
                       as: "toranotNew.userDetails"
                   }
                },{ $unwind: "$toranotNew.userDetails"},
                {$match:{
                   $and:[{"toranotNew.userDetails._id" : ObjectId(idUser)},{"status":{ "$nin": ["asking" , "reject"]}}]
               }},
                { $lookup:
                   {
                     from: "toranots",
                     localField: "toranotIdOld",
                     foreignField: "_id",
                     as: "toranotOld"
             } },{ $unwind: {
                    path: "$toranotOld",
                    preserveNullAndEmptyArrays: true}},
                 { $lookup:
                    {
                        from: "users",
                        localField: "toranotOld.idUser",
                        foreignField: "_id",
                        as: "toranotOld.userDetails"
                    }  },{$unwind: "$toranotOld.userDetails" }]).toArray().then(result => resolve(result)))




               Promise.all([promise1,promise2,promise3,promise4,promise5]).then(values => {
        //           console.log("values" , values[1] , "1" , values[2]  ,"2", values[3] , "3" ,values[4] , "4" , values[5]);
                   sendable.push(values[0]);
                   sendable.push(values[1]);
                   sendable.push(values[2]);
                   sendable.push(values[3]);
                   sendable.push(values[4]);
                   res.json(sendable);
                   db.close();
               });
             });
   });
}


module.exports = getExchangesAndTornot;