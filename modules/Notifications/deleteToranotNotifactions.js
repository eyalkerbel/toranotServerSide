const {ObjectId} = require("mongodb");
const e = require("express");

 function deleteToranotNotifactions(dbo,toranotId,friendId) {
     console.log("toranotId" , toranotId);
    return new Promise(resolve => dbo.collection("notifications").findOne({"toranotId": ObjectId(toranotId),"action":"addToranot"}).then(async item => {
        console.log("item" , item);
        if(item) {
        if(item.seen == false) {
            await dbo.collection("notifications").deleteOne({"_id": ObjectId(item._id)});
            console.log("false");

        } else {
            var noti = {
                toranotId: ObjectId(item.id),
                friendId: friendId,
                seen: "false",
                action: "deleteToranot"
            }
            await dbo.collection("notification").insertOne(noti);
            console.log("true");
        }
        console.log("finish");
        resolve(true);
    } else {
        console.log("we noot find");
        resolve(false);
    }
}
    ));


}


module.exports = deleteToranotNotifactions;