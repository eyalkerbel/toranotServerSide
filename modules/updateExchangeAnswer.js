const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');


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
        const oldDate = item.oldDate;
        const newDate = item.newDate;
        console.log("my data" , data);
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
                        dbo.collection("toranutsthismonth").updateOne({ "_id":ObjectId(oldDate.id)},{"$set":{"name": newDate.name,"userid": newDate.userid , "points": -1 }},{upsert: true},function(err, response) {  
                            console.log("result" , response);  
                });
                


                dbo.collection("toranutsthismonth").updateOne({"_id":ObjectId(newDate.id)},{"$set":{"name": oldDate.name,"userid": oldDate.userid , "points": -1 }},{},function(err, response) {    
                });

                dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(item._id)},{"$set":{"status": "approve", "managerMessage": message}},{},function(err, response) {    
                });
                } else {
                    console.log("manager reject" , item._id);
                    dbo.collection("toranotexchanges").updateMany({"_id": ObjectId(item._id)},{"$set":{"status": "decline" , "managerMessage": message}},{},function(err, response) {    
                    });
                }
                res.status(200).json("challenge accepted");
                db.close();
                    
            ;
        });
        
});
}

module.exports = updateExchangeAnswer;