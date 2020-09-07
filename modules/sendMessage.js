const { FORMERR } = require("dns");
//const { default: user } = require("../../toranotForntedSide/src/Reducers/UserReducer");
const jwt = require('jsonwebtoken');




async function sendMessage(url,MongoClient,req,res) {
    var BearerHeader = req.headers["authorization"];
    var splitted = BearerHeader.split(" ");
    jwt.verify(splitted[1], "iamthesecretkey", (err, verified) => {
      if (err !== null) {
        res.status(400).json("invalid jwt")
        return;
      }
      console.log("verfid" , verified);
      var obi = verified.payload;
      if(obi.userid != null) {
        var userid = obi.userid;
      } else {
        var userid = obi.sn;
      }
      var name = obi.name;
      console.log("userid hadd",userid);


    var {header,body,names} = req.body;
    console.log("send message beckend",names)
    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
         function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          dbo.collection("users").find({}).toArray(async function(err,found) {
          var users = await getUsers(dbo,names,found);
          console.log("users" , users);
          for(var i=0;i<users.length;i++) {
              if(users[i].userid != null) {
              var data = {
                  header: header,
                  body: body,
                  useridSend: userid,
                  useridGet: users[i].userid,
                  name: name
              }
            }
            else if(users[i].sn != null) {
                var data = {
                    header: header,
                    body: body, 
                    useridSend: userid,
                    useridGet : users[i].sn,
                    name:name,
                    read: false,

                }
              }
              dbo.collection("messages").insert(data);
              db.close();
          }
          });
});
});

}

async function getUsers(dbo, names,found) {
    let users =[];
   //     console.log(names.length);
        for(var i=0;i<found.length;i++) {
            for(j=0;j<names.length;j++) {
                if(found[i].name == names[j]) {
                    console.log("good");
                    users.push(found[i]);
                    j = names.length;
                }
            }
            if(found.length-1 == i) {
                console.log("finish azer");
                console.log("users",users)
                return users;
            }
        }

}


 


module.exports = sendMessage;