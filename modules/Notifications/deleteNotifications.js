const { ObjectId } = require("mongodb");


function deleteNotifications(dbo, idUser, selectValue) {
  console.log("seletcValue", selectValue)
  const array = []
  if (selectValue == 0) {
    return new Promise(resolve =>
      //  dbo.collection("notifications").aggregate([
      // {
      //   $lookup: {
      //     from: "toranots",
      //     localField: "toranotId",
      //     foreignField: "_id",
      //     as: "toranot"
      //   }
      // }, {
      //   $unwind: {
      //     path: "$toranot",
      //     preserveNullAndEmptyArrays: true
      //   }
      // }, {
      //   $match: {
      //     $and: [{ "toranot.idUser": ObjectId(idUser) }, { $or: [{ action: "addToranot" }, { action: "deleteToranot" }] }]
      //   }
      // } ]
      dbo.collection("notifications").find({ myId: ObjectId(idUser), $or: [{ action: "addToranot" }, { action: "deleteToranot" }] }).forEach(doc => {
        // array.push(dbo.collection("notifications").deleteOne({"_id": doc._id}));
        array.push(dbo.collection("notifications").findOneAndUpdate({ "_id": doc._id }, { $set: { seen: true } }, { new: true }));
      }).then(() => {
        Promise.all(array).then(values => {
          console.log("finish");
          resolve(true);
        });
      }));
  }

  if (selectValue == 1) {
    return new Promise(resolve =>
      // dbo.collection("notifications").aggregate([
      //   {
      //     $lookup: {
      //       from: "toranots",
      //       localField: "toranotId",
      //       foreignField: "_id",
      //       as: "toranot"
      //     }
      //   }, {
      //     $unwind: {
      //       path: "$toranot",
      //       preserveNullAndEmptyArrays: true
      //     }
      //   }, {
      //     $match: {
      //       $and: [{ "toranot.idUser": ObjectId(idUser) }, { action: "wantExchange" }]
      //     }
      //   }
      //  ]
      dbo.collection("notifications").find({ myId: ObjectId(idUser), action: "wantExchange" }).forEach(doc => {

        dbo.collection("notifications").findOneAndUpdate({ "_id": doc._id }, { $set: { seen: true } }, { new: true }).then(result => {
          resolve(true)
        });
      }));
  }
  if (selectValue == 2) {
    return new Promise(resolve =>
      //   dbo.collection("notifications").aggregate([
      //   {
      //     $lookup: {
      //       from: "toranots",
      //       localField: "toranotId",
      //       foreignField: "_id",
      //       as: "toranot"
      //     }
      //   }, {
      //     $unwind: {
      //       path: "$toranot",
      //       preserveNullAndEmptyArrays: true
      //     }
      //   }, {
      //     $match: {
      //       $and: [{ "toranot.idUser": ObjectId(idUser) }, { $or: [{ action: "toranApprove" }, { action: "toranReject" }, { action: "managerApprove" }, { action: "managerReject" }] }]
      //     }
      //   }
      // ]
      dbo.collection("notifications").find({ myId: ObjectId(idUser), $or: [{ action: "toranApprove" }, { action: "toranReject" }] }).forEach(doc => {

        // dbo.collection("notifications").findOneAndUpdate({ "_id": doc._id }, { $set: { seen: true } },{ new: true });

        return dbo.collection("notifications").findOneAndUpdate({ "_id": doc._id }, { $set: { seen: true } }, { new: true });

      }).then(() => resolve(true)));

  }
  if (selectValue == "askingManager") {
    dbo.collection("toranim").findOneAndUpdate({ monthTab: 1, idUser: ObjectId(userId) }, { $set: { "friendId": new ObjectId(friendId) } }, { new: true })
    return dbo.collection("notificationsManager").deleteMany({});
  }


}




module.exports = deleteNotifications;