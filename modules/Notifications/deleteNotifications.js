const {ObjectId} = require("mongodb");


function deleteNotifications(dbo,idUser,selectValue) {
console.log("seletcValue", selectValue)
const array  = []
    if(selectValue == 0) {
return new Promise(resolve => dbo.collection("notifications").aggregate([
    { $lookup:  {
        from: "toranots",
        localField: "toranotId",
        foreignField: "_id",
        as: "toranot" 
      }}, { $unwind: {
        path: "$toranot",
        preserveNullAndEmptyArrays: true
      }}, {$match:{
        $and:[{"toranot.idUser" : ObjectId(idUser)} , { $or: [{action: "addToranot"},{action: "deleteToranot"} ] } ]
    } }
]).forEach(doc =>
  { 
    console.log("doc" , doc);
    array.push(dbo.collection("notifications").deleteOne({"_id": doc._id}));
  }).then(() => {
    Promise.all(array).then(values => { 
    console.log("finish");
 resolve(true);
    });
}));
}

if(selectValue == 1) {
    return new Promise(resolve => dbo.collection("notifications").aggregate([
        { $lookup:  {
            from: "toranots",
            localField: "toranotId",
            foreignField: "_id",
            as: "toranot" 
          }}, { $unwind: {
            path: "$toranot",
            preserveNullAndEmptyArrays: true
          }}, {$match:{
            $and:[{"toranot.idUser" : ObjectId(idUser)} , {action: "wantExchange"} ]
        } }
    ]).forEach(doc => dbo.collection("notifications").deleteOne({"_id": doc._id}).then(result => {
        //  console.log("result" , result)
       resolve(true)
              }
              )));
 }
 if(selectValue == 2) {
  return new Promise(resolve => dbo.collection("notifications").aggregate([
      { $lookup:  {
          from: "toranots",
          localField: "toranotId",
          foreignField: "_id",
          as: "toranot" 
        }}, { $unwind: {
          path: "$toranot",
          preserveNullAndEmptyArrays: true
        }}, {$match:{
          $and:[{"toranot.idUser" : ObjectId(idUser)} , { $or: [{action: "toranApprove"},{action: "toranReject"}, {action:"managerApprove"}, {action:"managerReject"} ] } ]
        } }
  ]).forEach(doc => {
    console.log("doc" , doc);
  return dbo.collection("notifications").deleteOne({"_id": doc._id});
   }).then(() =>  resolve(true)));
          
  }
if(selectValue == "askingManager") {
  return dbo.collection("notificationsManager").deleteMany({});
}


}




module.exports = deleteNotifications;