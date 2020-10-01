const jwt = require('jsonwebtoken');
const Joi = require('joi');
const {ObjectId} = require("mongodb");
const addNewNotification = require("./Notifications/addNewNotification");
function setToranot(url,MongoClient,req,res) {
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
        MongoClient.connect(
            url,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            },
              async function (err, db) {
                if (err) throw err;
                var dbo = db.db("newmaindb");
                await NotInHaadfot(dbo,data).then(goodPlace => {
                    console.log("resolve", goodPlace);
                    if(goodPlace == false) {
                       db.close();
                    } else {
                        const proimse2 =  new Promise(resolve => dbo.collection("users").findOneAndUpdate({userid:data.userid}, {$inc: {'points': 1 } }, {new: true }).then(() => resolve(true)));
                        const proimse3 = AddToranotThisMonth(dbo,data).then(_id => addNewNotification(dbo,_id,ObjectId(obi._id),"addToranot"));
                        Promise.all([proimse2,proimse3]).then(value => {
                            console.log("finsh all");
                             res.json(true);
                             db.close();
                        });
                    }
                });
            });
        });
}


function Get_IDByUserID(dbo,userid) {
   
return new Promise(resolve => dbo.collection("users").findOne({"userid": userid},function(err,response) {
     resolve(response._id);
}));
}

function AddToranotThisMonth(dbo,data) {
    return new Promise(resolve => Get_IDByUserID(dbo,data.userid).then(function(id)  {
              var newData = {
                  date: data.date,
                  monthTab: data.monthTab,
                  idUser: id,
                  userStatus: "unknown",
                  availableForExchange: true,
                  toran: data.toran
              };
              return newData;
          }).then(function(newData) {
               dbo.collection("toranots").insertOne(newData).then((element) => {
              console.log("finsh add toranot",element.ops[0]._id);
              resolve(element.ops[0]._id);
               
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



module.exports = setToranot;