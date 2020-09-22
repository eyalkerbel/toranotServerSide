const {ObjectId } = require("mongodb");
function getDetails(dbo,idUser) {
    return new Promise(resolve => dbo.collection("users").findOne({"_id":ObjectId(idUser)},function(err,element) {
            resolve(element);
    })
    );
}
module.exports = getDetails;