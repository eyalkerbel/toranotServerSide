const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const getToranotItemForFronted = require("././MongoEzer/getToranotItemForFronted");


function getDataForInitRedux(url, MongoClient, req, res, db) {
  var BearerHeader = req.headers["authorization"];
  var splitted = BearerHeader.split(" ");
  jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
    if (err !== null) {
      res.status(400).json("invalid jwt");
      return;
    }
    console.log(verified);
    //console.log(err);
    var obi = verified.payload;
    var _id = obi._id;
    const { permissionlvl } = verified.payload;
    // console.log("userid hadd",_id);
    // MongoClient.connect(
    //   url,
    //   {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    //   },
    //   function (err, db) {
    //     if (err) throw err;
    var dbo = db.db("newmaindb");
    const promise1 = new Promise(resolve => dbo.collection("users").findOne({ "_id": ObjectId(_id) }).then(result => resolve(result)));
    const promise2 = dbo.collection("users").find({}).toArray();
    const promise3 = dbo.collection("toranots").aggregate([{
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "userDetails"
      }
    }, { $unwind: "$userDetails" }, { $match: { "monthTab": 0 } }]).toArray();
    const promise4 = dbo.collection("toranots").aggregate([{
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "userDetails"
      }
    }, { $unwind: "$userDetails" }, { $match: { "monthTab": 1 } }]).toArray();

    const promise5 = returnNotificationByValue(dbo, _id, permissionlvl);
    const promise6 = dbo.collection("toranim").aggregate([{
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "userDetails"
      }
    }, { $unwind: "$userDetails" }, { $match: { "monthTab": 0 } }]).toArray();
    const promise7 = dbo.collection("toranim").aggregate([{
      $lookup: {
        from: "users",
        localField: "idUser",
        foreignField: "_id",
        as: "userDetails"
      }
    }, { $unwind: "$userDetails" }, { $match: { "monthTab": 1 } }]).toArray();
    const promise8 = dbo.collection("haadafottest").find({ idUser: ObjectId(_id) }).toArray();
    const promsie9 = dbo.collection("haadafottest").find().toArray();
    const promise10 = dbo.collection("jobs").find().toArray();
    const promise11 = getExchangesAndTornot(dbo, verified);
    const promise12 = dbo.collection("toranotexchanges").aggregate([
      { $match: { status: "convincing" } },
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdOld",
          foreignField: "_id",
          as: "toranotOld"
        }
      }, {
        $unwind: {
          path: "$toranotOld",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $lookup: {
          from: "users",
          localField: "toranotOld.idUser",
          foreignField: "_id",
          as: "toranotOld.userDetails"
        }
      }, { $unwind: "$toranotOld.userDetails" },
      {
        $lookup: {
          from: "toranots",
          localField: "toranotIdNew",
          foreignField: "_id",
          as: "toranotNew"
        }
      }, { $unwind: "$toranotNew" },
      {
        $lookup:
        {
          from: "users",
          localField: "toranotNew.idUser",
          foreignField: "_id",
          as: "toranotNew.userDetails"
        }
      }, { $unwind: "$toranotNew.userDetails" },

    ]).toArray();


    // console.log("saas");
    Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8, promsie9, promise10, promise11, promise12]).then(values => {
      //  console.log("values" , values)

      values[4].map(el => {
        if (el.toranotObject != undefined) {
          el["toranot"] = el.toranotObject;
        }
      });
      res.status(200).json(values);

      //  db.close();
    });
  });
  //  });
}
function returnNotificationByValue(dbo, idUser, permissionlvl) {
  if (permissionlvl == "admin") {
    // return dbo.collection("notificationsManager").find({}).toArray();
    return dbo.collection("notificationsManager").aggregate([
      {
        $lookup: {
          from: "toranotexchanges",
          localField: "exchange",
          foreignField: "_id",
          as: "exchangeObject"
        }
      }, {
        $unwind: {
          path: "$exchangeObject",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "toranots",
          localField: "exchangeObject.toranotIdOld",
          foreignField: "_id",
          as: "exchangeObject.toranotOldObject"
        }
      }, {
        $unwind: {
          path: "$exchangeObject.toranotOldObject",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "toranots",
          localField: "exchangeObject.toranotIdNew",
          foreignField: "_id",
          as: "exchangeObject.toranotNewObject"
        }
      }, {
        $unwind: {
          path: "$exchangeObject.toranotNewObject",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "exchangeObject.toranotOldObject.idUser",
          foreignField: "_id",
          as: "exchangeObject.toranotOldObject.userDetails"
        }
      }, {
        $unwind: {
          path: "$exchangeObject.toranotOldObject.userDetails",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "exchangeObject.toranotNewObject.idUser",
          foreignField: "_id",
          as: "exchangeObject.toranotNewObject.userDetails"
        }
      }, {
        $unwind: {
          path: "$exchangeObject.toranotNewObject.userDetails",
          preserveNullAndEmptyArrays: true
        }
      }]).toArray();




  } else {
    return dbo.collection("notifications").aggregate([
      {
        $lookup: {
          from: "toranots",
          localField: "toranotId",
          foreignField: "_id",
          as: "toranot"
        }
      }, {
        $unwind: {
          path: "$toranot",
          preserveNullAndEmptyArrays: true
        }
      }
      ,
      {
        $match: {
          $or: [{ "toranot.idUser": ObjectId(idUser) }, { toranotObject: { $exists: true } }]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "friendId",
          foreignField: "_id",
          as: "userDetails"
        }
      }, {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true
        }
      }, {
        $match: {
          $and: [{ "myId": ObjectId(idUser) }]
        }
      }
    ]).toArray();
  }
}

function getExchangesAndTornot(dbo, verified) {
  return new Promise(resolve => {
    var obi = verified.payload;
    var idUser = obi._id;
    const { type } = obi;
    const promise1 = new Promise(resolve => dbo.collection("toranots").find({ "idUser": new ObjectId(idUser), "monthTab": 0 }).toArray().then(result => getToranotItemForFronted(dbo, result)).then(res => resolve(res)));
    const promise2 = new Promise(resolve => dbo.collection("toranots").find({ "idUser": new ObjectId(idUser), "monthTab": 1 }).toArray().then(async result => {
      var temp = await getToranotItemForFronted(dbo, result);
      resolve(temp);
    }));
    // const promise3 = new Promise(resolve => dbo.collection("toranotexchanges").find({'oldDate.userid':userid}).toArray().then(result => resolve(result)));
    const promise3 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdOld",
          foreignField: "_id",
          as: "toranotOld"
        }
      }, {
        $unwind: {
          path: "$toranotOld",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "toranotOld.idUser",
          foreignField: "_id",
          as: "toranotOld.userDetails"
        }
      }, { $unwind: "$toranotOld.userDetails" },
      // {
      //   $match: {
      //     $and: [{ "toranotOld.userDetails._id": ObjectId(idUser) }]
      //   }
      // },
      {
        $lookup: {
          from: "toranots",
          localField: "toranotIdNew",
          foreignField: "_id",
          as: "toranotNew"
        }
      }, {
        $unwind: {
          path: "$toranotNew",
          preserveNullAndEmptyArrays: true

        },
      },
      {
        $lookup: {
          from: "users",
          localField: "toranotNew.idUser",
          foreignField: "_id",
          as: "toranotNew.userDetails"
        }
      }, {
        $unwind: {
          path: "$toranotNew.userDetails", preserveNullAndEmptyArrays: true
        }
      },
      { // not equel 2 and idnot null
        $match: {
          $and: [{ "toranotOld.userDetails._id": ObjectId(idUser) }, { $or: [{ "toranotNew": { $ne: {} } }, { "typeExchange": 2 }] }]

        }
      }
    ]).toArray().then(result => resolve(result)));

    // const promise4 = new Promise(resolve => dbo.collection("toranotexchanges").find({'newDate.userid':userid}).toArray().then(result => resolve(result)))
    const promise4 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdNew",
          foreignField: "_id",
          as: "toranotNew"
        }
      }, {
        $unwind: {
          path: "$toranotNew",
          preserveNullAndEmptyArrays: true

        },
      },
      {
        $lookup:
        {
          from: "users",
          localField: "toranotNew.idUser",
          foreignField: "_id",
          as: "toranotNew.userDetails"
        }
      }, { $unwind: { path: "$toranotNew.userDetails", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $or: [{ "toranotNew.userDetails._id": ObjectId(idUser) }, { $and: [{ "typeExchange": 2, "toranotIdNew": null, "rejectedIDS": { $not: { $all: [ObjectId(idUser)] } } }] }]
        }
      },
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdOld",
          foreignField: "_id",
          as: "toranotOld"
        }
      }, {
        $unwind: {
          path: "$toranotOld",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "toranotOld.idUser",
          foreignField: "_id",
          as: "toranotOld.userDetails"
        }
      }, { $unwind: "$toranotOld.userDetails" },
      {
        $match: {
          $and: [{ "toranotOld.userDetails.type": ObjectId(type) }]
        }
      },
    ]).toArray().then(result => resolve(result)))
    const promise5 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdNew",
          foreignField: "_id",
          as: "toranotNew"
        }
      }, { $unwind: "$toranotNew" },
      {
        $lookup:
        {
          from: "users",
          localField: "toranotNew.idUser",
          foreignField: "_id",
          as: "toranotNew.userDetails"
        }
      }, { $unwind: "$toranotNew.userDetails" },
      {
        $match: {
          $and: [{ "toranotNew.userDetails._id": ObjectId(idUser) }, { "status": { "$nin": ["asking", "reject"] } }]
        }
      },
      {
        $lookup:
        {
          from: "toranots",
          localField: "toranotIdOld",
          foreignField: "_id",
          as: "toranotOld"
        }
      }, {
        $unwind: {
          path: "$toranotOld",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup:
        {
          from: "users",
          localField: "toranotOld.idUser",
          foreignField: "_id",
          as: "toranotOld.userDetails"
        }
      }, { $unwind: "$toranotOld.userDetails" }]).toArray().then(result => resolve(result)))

    // const promise6 = new Promise(resolve => dbo.collection("toranotexchanges").aggregate([
    //   {
    //     $lookup:
    //     {
    //       from: "toranots",
    //       localField: "toranotIdOld",
    //       foreignField: "_id",
    //       as: "toranotOld"
    //     }
    //   }, {
    //     $unwind: {
    //       path: "$toranotOld",
    //       preserveNullAndEmptyArrays: true
    //     }
    //   }, {
    //     $match: {
    //       $and: [{ "typeExchange": 2, "toranotIdNew": null ,  }]
    //     }
    //   },
    //   {
    //     $lookup:
    //     {
    //       from: "users",
    //       localField: "toranotOld.idUser",
    //       foreignField: "_id",
    //       as: "toranotOld.userDetails"
    //     }
    //   },
    //   { $unwind: "$toranotOld.userDetails" }]).toArray().then(result => resolve(result)))
    // const promise6 = dbo.collection("toranotexchanges").find({ "typeExchange": 2, toranotIdNew: null }).toArray();

    Promise.all([promise1, promise2, promise3, promise4, promise5]).then(values => {

      // values[3] = values[3].concat(values[5]);
      resolve(values);
    });
  });
}



module.exports = getDataForInitRedux;