const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongodb = require("mongodb")
const { ObjectId } = require("mongodb");
const deleteToranotNotifactions = require("./Notifications/deleteToranotNotifactions");

function deleteToranot(url, MongoClient, req, res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
        if (err !== null) {
            res.status(400).json("invalid jwt")
            return;
        }
        console.log("VERFIED", req.body);
        var obi = verified.payload;
        var permissionlvl = obi.permissionlvl;
        var _id = req.body._id;

        if (permissionlvl === "admin") {
            console.log(_id)
            //  const ValidOrNot = Joi.validate(_id, schema);
            // if (ValidOrNot.error === null) {
            MongoClient.connect(
                url,
                {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                },
                function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("newmaindb");
                    // var dataNotifcation = {
                    //     date: req.body.date,
                    //     userid: req.body.userDeteails.userid,
                    //     action: "delete"
                    // }
                    // var userid = req.body.userid // before change
                    console.log("req.bdy", req.body);
                    var userid = req.body.userDetails.userid;
                    var toranot = req.body;
                    console.log("toranot kda", userid);
                    // const promise10 = dbo.collection("notifications").insert(dataNotifcation);
                    // const promise4 = addNewNotification(dbo, values[0]._id, ObjectId(data.userDetails._id), ObjectId(obi._id), "addToranot");
                    // const promise4 = addNewNotification(dbo,values[0]._id,ObjectId(data.userDetails._id),ObjectId(obi._id),"addToranot");

                    const promise1 = deleteToranotNotifactions(dbo, _id, obi._id, toranot);
                    const promise2 = new Promise(resolve => dbo.collection("toranots").deleteOne({ _id: new ObjectId(_id) }).then(() => resolve(true)));
                    const promise3 = new Promise(resolve => dbo.collection("users").findOneAndUpdate({ userid: userid }, { $inc: { 'points': -1 } }, { new: true }).then(() => resolve(true)));
                    Promise.all([promise1, promise2, promise3]).then(values => {
                        res.status(200).json("success");
                        db.close();
                    });

                });

        } else {
            res.status(400).json("not an admin");
        }
    });
}

module.exports = deleteToranot;