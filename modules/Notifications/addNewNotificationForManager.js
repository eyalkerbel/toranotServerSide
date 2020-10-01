
function addNewNotificationForManager(dbo,toranotExchangeId,action) {
    return dbo.collection("notificationsManager").insert({exchange: toranotExchangeId,action: action});
}
module.exports = addNewNotificationForManager;