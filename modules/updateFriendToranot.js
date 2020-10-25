const { ObjectId } = require("mongodb");
const addNewNotification = require("./Notifications/addNewNotification"); 


function updateFriendToranot(req,res,db) {
    const {friendId,userId,asisstValue} = req.body;
    console.log("body" , friendId , "," , userId);
    var dbo = db.db("newmaindb");
    dbo.collection("toranim").findOneAndUpdate({monthTab:1,idUser:ObjectId(userId)} , {$set: {"friendId":new ObjectId(friendId)}} ,{new: true}).then((message) => {
    console.log("success" ,message);
    res.status(200).json();
    });
    if(friendId != null) {
    addNewNotification(dbo,ObjectId(friendId),ObjectId(friendId),ObjectId(userId),"addToranotTogther");
    } else {
    addNewNotification(dbo,ObjectId(asisstValue._id),ObjectId(asisstValue._id),ObjectId(userId),"cancelToranotToghter");
    }
}

module.exports = updateFriendToranot;