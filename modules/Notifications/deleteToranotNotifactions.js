const { ObjectId } = require("mongodb");
const e = require("express");
const { object } = require("joi");
const addNewNotification = require("./addNewNotification");
function deleteToranotNotifactions(dbo, toranotId, friendId, toranot) {
    var currentDate = new Date();
    console.log("toranotId", toranotId);
    return new Promise(resolve => dbo.collection("notifications").findOne({ "toranotId": ObjectId(toranotId), "action": "addToranot" }).then(async item => {
        console.log("item", item);
        if (item) {
            if (item.seen == false) {
                await dbo.collection("notifications").deleteOne({ "_id": ObjectId(item._id) });
                console.log("false");

            } else {
                var noti = {
                    toranotId: ObjectId(item.id),
                    myId: ObjectId(item.myId),
                    friendId: ObjectId(friendId),
                    seen: false,
                    action: "deleteToranot",
                    date: currentDate,
                    toranotObject: toranot
                }
                await dbo.collection("notifications").insertOne(noti);
                console.log("true");
            }
            console.log("finish");
            resolve(true);
        } else {

            var noti = {
                toranotId: ObjectId(toranotId),
                myId: ObjectId(toranot.idUser),
                friendId: ObjectId(friendId),
                seen: false,
                action: "deleteToranot",
                date: currentDate,
                toranotObject: toranot
            }
            await dbo.collection("notifications").insertOne(noti);
            //   await addNewNotification(dbo, ObjectId(toranotId), ObjectId(toranot.idUser), ObjectId(friendId), "deleteToranot");
            console.log("we noot find");
            resolve(false);
        }
    }
    ));


}


module.exports = deleteToranotNotifactions;