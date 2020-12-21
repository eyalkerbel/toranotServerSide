function addNewNotificationForManager(dbo, toranotExchangeId, action) {
    return dbo.collection("notificationsManager").insert({
        exchange: toranotExchangeId, action: action, date: new Date(), seen: false,
    });
}
module.exports = addNewNotificationForManager;