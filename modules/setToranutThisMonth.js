const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { resolve } = require('path');
const { runInNewContext } = require('vm');

function setToranutThisMonth(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log(verified);
        var obi = verified.payload;
        var permissionlvl = obi.permissionlvl;
        var data = req.body;
        console.log("new",data);
        if (permissionlvl === "admin") {
            const schema = Joi.object().keys({
                date: Joi.date().required(),
                name: Joi.string().required(),
                type: Joi.number().required(),
                userid: Joi.string().required(),
                toran: Joi.number().required(),
                points: Joi.number().required(),
            })
            const ValidOrNot = Joi.validate(data, schema);
            if (ValidOrNot.error === null) {
                MongoClient.connect(
                    url,
                    {
                        useNewUrlParser: true,
                        useUnifiedTopology: true
                    },
                      async function (err, db) {
                        if (err) throw err;
                        var dbo = db.db("newmaindb");
                    //    var goodPlace = true;
                        var dataNotifcation = {
                            date: req.body.date,
                            userid: req.body.userid,
                            action: "place"
                        } 
                        // dbo.collection("notifications").insertOne(dataNotifcation);
                         await NotInHaadfot(dbo,data).then(goodPlace => {
                             console.log("resolve", goodPlace);
                             if(goodPlace == false) {
                                db.close();
                             } else {
                                const promise1 = dbo.collection("notifications").insertOne(dataNotifcation).then(() => console.log("finish promise 1"));
                                const proimse2 =  new Promise(resolve => dbo.collection("users").findOneAndUpdate({userid:data.userid}, {$inc: {'points': 1 } }, {new: true }).then(() => {
                                 //   console.log("finish promise 2");
                                     resolve(true)
                                }));
                                const proimse3 = AddToranotThisMonth(dbo,data);
                            //    AddToranotThisMonth(dbo,data).then((item) => {
                            //         console.log("finsh all" , item);
                            //         res.json(true);
                            //         db.close();
                               
                            //     });

                                Promise.all([promise1,proimse2,proimse3]).then(value => {
                                //    console.log("finsh all");
                                    res.json(true);
                                    db.close();
                                });
                              

                             }

                         })

                        //  dbo.collection("haadafottest").find({userid:data.userid}).toArray(async function(err,foundDate) {
                        //     var askingDate = new Date(data.date).getDate();
                        //     console.log("found date" , foundDate);
                        //     foundDate.forEach(element => {
                        //     var begin = new Date(element.begindate).getDate();
                        //     var end = new Date(element.enddate).getDate();
                        //     if(askingDate >= begin && askingDate <= end) {
                        //         console.log("not good");
                        //         goodPlace = false;

                        //     }
                        // });
                      //  console.log("dssdsddssd" , data.userid);
                        
                //         var userDetails = await Get_IDByUserID(dbo,data.userid);
                //    //     console.log("_id" , _id);
                //         var newData = {
                //             date: data.date,
                //             idUser: userDetails,
                //             userStatus: "unknown",
                //             availableForExchange: true
                //         };
                //         console.log("goodPlace" , goodPlace);
                //         if(goodPlace == true) {
                //             dbo.collection("toranutsthismonth").insertOne(newData);
                //             console.log(data);
                //             var myPoints = data.points + 1;
                //             //console.log("POINTS",myPoints);
                //             dbo.collection("users").findOneAndUpdate({userid:data.userid}, {$inc: {'points': 1 } }, {new: true },function(err, response) {
                //                 console.log("final good place", goodPlace);
                //                 res.json(goodPlace);
                //                 db.close();

                //             }
                //             );
                //         }         
                    });
               // });
                
                


            } else {
                res.status(400).json("schema blocked")
                console.log("schema blocked")
            }
        } else {
            res.status(400).json("not an admin");
        }
    });

}

 function Get_IDByUserID(dbo,userid) {
    // dbo.collection("users").findOne({"userid": userid},function(err,response) {
    //     console.log("response" , response);
    // });
   // console.log("useridFunction" , userid)
return new Promise(resolve => dbo.collection("users").findOne({"userid": userid},function(err,response) {
  //  console.log("response" , response);
     resolve(response._id);
}));
}


function AddToranotThisMonth(dbo,data) {
  return new Promise(resolve => Get_IDByUserID(dbo,data.userid).then(function(id)  {
       // console.log("idpromise" ,id );
            var newData = {
                date: data.date,
                idUser: id,
                userStatus: "unknown",
                availableForExchange: true,
                toran: data.toran
            };
            //console.log("enter data",newData);
            return newData;
        }).then(function(newData) {
             dbo.collection("toranutsthismonth").insertOne(newData).then(() => {
          //  console.log("finsh add",newData);
            resolve(true);
             
        });
    }));
}



function NotInHaadfot(dbo,data) {
    console.log("userid" , data.userid);
    return new Promise(resolve => dbo.collection("users").findOne({userid:data.userid}).then(elemnt => {
        console.log("elemnt" ,elemnt);
        dbo.collection("haadafottest").find({idUser:elemnt._id}).toArray().then(items => {
        console.log("items" , items );
        if(items.length == 0) {
            resolve(true);
        } 
        var askingDate = new Date(data.date).getDate();
        items.some(item => {
            var begin = new Date(item.begindate).getDate();
            var end = new Date(item.enddate).getDate();
            if(askingDate >= begin && askingDate <= end) {
                console.log("false");
               resolve(false);
            }
            else {
                console.log("none");
            }
        });
        console.log("true");
        resolve(true);
    })
}   )
    );
}


module.exports = setToranutThisMonth;
// module.exports = Get_IDByUserID;