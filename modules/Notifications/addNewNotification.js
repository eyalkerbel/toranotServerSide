function addNewNotification(dbo,toranotId,myId,friendId,action) {

    console.log("VALUES" , toranotId, myId ,friendId , action);
return new Promise(resolve  => resolve(dbo.collection("notifications").insert( {
    toranotId: toranotId,
    myId:myId,
    friendId:friendId,
    seen:false,
    action: action 
    })));
   
     
}

module.exports = addNewNotification;