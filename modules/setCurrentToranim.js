const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");


function setCurrentToranim(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log(verified);
      var obi = verified.payload;
      var userid = obi.userid;
      console.log("req.body settoran" , req.body.arrayUsers);
      const {arrayUsers} = req.body
      console.log("toranimThisMonth" , arrayUsers);
      console.log("userid hadd",userid);
      MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");

   // //    dbo.collection("toranimThisMonth").deleteMany({},function(err,response) {
   // //       });
   // //       dbo.collection("toranimNextMonth").deleteMany({},function(err,response) {
   // //     });
   dbo.collection("toranim").createIndex({idUser: 1, monthTab:1 });

            const promiseArray = [];
            for(const element of arrayUsers) {
                if(element.isChosen == false) {
                    console.log("enter to add" , element.item.userDetails._id );

                    var toranObject = {
                    idUser:new ObjectId(element.item.userDetails._id),
                    monthTab: element.monthValue
                    }
                    const promise = dbo.collection("toranim").insert(toranObject);
                    promiseArray.push(promise);
                } else {
                    console.log("enter to delete" , element.item.userDetails._id );
                    const promise = dbo.collection("toranim").deleteOne({"idUser":new ObjectId(element.item.userDetails._id), "monthTab":element.item.monthTab});
                    promiseArray.push(promise);
                } 
            }
            Promise.all(promiseArray).then(values => {
                console.log("finish-setToranim",);
                db.close();
            });

   
        // //   dbo.collection("toranimThisMonth").deleteMany({},function(err,response) {
        // //   });
        // //   dbo.collection("toranimNextMonth").deleteMany({},function(err,response) {
        // // });
        //     for(var i=0;i<arrayUsers.length;i++) {
        //         var element = arrayUsers[i];
        //         console.log("elemnt" , element);
        //         if(element.monthValue == 0) {
        //             if(element.isChosen == false) {
        //                 dbo.collection("toranimThisMonth").insert(element.item , function(err, res) {
                      
        //                 if(i == arrayUsers.length -1) {
        //                     db.close();
        //                 }    
        //             });
        //             } else {
        //                 dbo.collection("toranimThisMonth").deleteOne({ _id: element.item._id} , function(err,response) {
        //                     if(i == arrayUsers.length -1) {
        //                         db.close();
        //                     }     
        //                 }); 
                       
        //             }
        //         } else {
        //             if(element.isChosen == false) {
        //                 dbo.collection("toranimNextMonth").insert(element.item , function(err, res) {
        //                     if(i == arrayUsers.length -1) {
        //                         db.close();
        //                     }    
        //                 });
        //             } else {
        //                 dbo.collection("toranimNextMonth").deleteOne({ _id: element.item._id} , function(err,response) {
        //                     if(i == arrayUsers.length -1) {
        //                         db.close();
        //                     }    
        //                 });
        //             }
        //         }
        //     }

        });
});
}
module.exports = setCurrentToranim;