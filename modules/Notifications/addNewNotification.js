function addNewNotification(dbo,toranotId,myId,friendId,action) {
    var datetime = new Date();

    console.log("VALUES" , toranotId, myId ,friendId , action);
return new Promise(resolve  => resolve(dbo.collection("notifications").insert( {
    toranotId: toranotId,
    myId:myId,
    friendId:friendId,
    seen:false,
    action: action,
    date: datetime
    })));
   
     
}

module.exports = addNewNotification;