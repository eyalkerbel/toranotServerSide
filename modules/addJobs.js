const jwt = require("jsonwebtoken");
const {ObjectId} = require("mongodb");
function addJobs(req,res,db) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        var dbo = db.db("newmaindb");
        var temp = [];
        // const jobs = req.body;
        // console.log("req.body" , req.body);
        // jobs.forEach((element,index) => {
        //     delete element['_id'];
        //     console.log("elemnt" , element);
        //     if(element.name != '' && element.numToranotPerDay != 0 ) {
        //         console.log("nooo");
        //         temp.push(element);
        //     }
        // });
        // dbo.collection("jobs").deleteMany({}).then(() => { 
        //     console.log("good delete",temp);   
        //     dbo.collection("jobs").insertMany(temp).then(() => {
        //         console.log("finish adding");
        //         res.json(temp);
        //     });
        // });

        console.log("dataAddJob" , req.body);
        const {action , values} = req.body;
        if(action == "add") {
            delete values['_id'];
            console.log("values" , values)
            dbo.collection("jobs").insert(values).then(item => {
            res.json(item.ops[0]);
            });
        } else if(action == "delete") {
            dbo.collection("jobs").deleteOne({"_id": ObjectId(values._id)})
        } else {
            const {key} = req.body;
            if(key == "name") {
               dbo.collection("jobs").findOneAndUpdate({"_id":ObjectId(values._id)} , {$set: {"name": values.value}});
            } else if(key == "amountToranim") {
                dbo.collection("jobs").findOneAndUpdate({"_id":ObjectId(values._id)} , {$set: {"numToranotPerDay": values.value}});
            } else {
                dbo.collection("jobs").findOneAndUpdate({"_id":ObjectId(values._id)} , {$set: {"description": values.value}});
            }
        }
    });
}

module.exports = addJobs;