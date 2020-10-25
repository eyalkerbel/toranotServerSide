const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const addNewNotification = require("../Notifications/addNewNotification");

function updateExchangeAnswer(url,MongoClient,req,res) {
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
        const {item , index , response, message} = data;
        const toranotIdOld = item.toranotIdOld;
        const toranotIdNew = item.toranotIdNew;
        console.log("my data" , item.toranotNew.idUser);
        // if (permissionlvl === "admin") {
            MongoClient.connect(
                url,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                function (err, db, ) {
                    if (err) throw err;
                    var dbo = db.db("newmaindb");
                    if(response == "approve") {
                        console.log("accept");
                //todo now
                
                    const promise1 = new Promise(resolve =>dbo.collection("toranots").updateOne({ "_id":ObjectId(toranotIdOld)},{"$set":{"idUser": ObjectId(item.toranotNew.userDetails._id)}},{upsert: true}).then(result => resolve(true)));
                    const promise2 = new Promise(resolve => dbo.collection("toranots").updateOne({"_id":ObjectId(toranotIdNew)},{"$set":{"idUser": ObjectId(item.toranotOld.userDetails._id)}},{}).then(result => resolve(true)));
                    const promise3 = new Promise(resolve =>   dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(item._id)},{"$set":{"status": "approve", "managerMessage": message}},{}).then(result => resolve(true)));
                    const promise4 = addNewNotification(dbo,new ObjectId(toranotIdOld) ,new ObjectId(item.toranotNew.idUser),"managerApprove");
             // const promise4 = addNewNotification(dbo,ObjectId(item.toranotOld.idUser),new ObjectId(item.toranotNew.idUser),new ObjectId(toranotIdOld) ,"managerApprove");                    const promise5 = addNewNotification(dbo,new ObjectId(toranotIdNew) ,new ObjectId(item.toranotOld.idUser),"managerApprove");
                    const promise5 = addNewNotification(dbo,new ObjectId(toranotIdNew) ,new ObjectId(item.toranotOld.idUser),"managerApprove");
                    Promise.all([promise1,promise2,promise3,promise4,promise5]).then(values => {
                        res.status(200).json("challenge accepted");
                        db.close();
                    })
                } else {
                    const promise1 =  dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(item._id)},{"$set":{"status": "decline" , "managerMessage": message}},{});
                    const promise4 = addNewNotification(dbo,new ObjectId(toranotIdOld) ,new ObjectId(item.toranotNew.idUser),"managerReject");
                    const promise5 = addNewNotification(dbo,new ObjectId(toranotIdNew) ,new ObjectId(item.toranotOld.idUser),"managerReject");
                        res.status(200).json("challenge accepted");
                        db.close();
                    

                    // console.log("manager reject" , item._id);
                    // dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(item._id)},{"$set":{"status": "decline" , "managerMessage": message}},{},function(err, response) {    
                    // });
                }

                    
            ;
        });
        
});
}

module.exports = updateExchangeAnswer;