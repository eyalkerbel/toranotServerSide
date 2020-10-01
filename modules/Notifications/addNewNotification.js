function addNewNotification(dbo,toranotId,friendId,action) {

    console.log("VALUES" , toranotId, friendId , action);
return new Promise(resolve  => resolve(dbo.collection("notifications").insert( {
    toranotId: toranotId,
    friendId:friendId,
    seen:false,
    action: action 
    })));
   
     
}

module.exports = addNewNotification;