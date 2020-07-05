const jwt = require("jsonwebtoken");


 function getPiority(url, MongoClient, req, res) {
    var userid = req.body.userid;
  //  console.log("userid",userid);

    let occupiedDay = [];

    MongoClient.connect(
        url,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        },
        function (err, db) {
          if (err) throw err;
          var dbo = db.db("newmaindb");
          
          dbo.collection("toranutsthismonth").find({}).toArray(async function(err,resultToranot){
            console.log("all");
              resultToranot.forEach(el => {
                var date = new Date(el.date)
                var day = date.getDate();
                occupiedDay.push(day);
              })
          });


          dbo.collection("haadafottest")
            .find({
            })
            .toArray(async function (err, result) {
                var sendable = [];

              if (result.length === 0) {
            
        } else {
          console.log("occupiedDay",occupiedDay)
        var newCounter = await getPiorityDays(result,occupiedDay);
        var userPoirity = await getPiorityUsers(result);
        sendable.push(newCounter);
        sendable.push(userPoirity);
        res.json(sendable);
        console.log("good");
        db.close();
              }
            });


});


}

async function getPiorityUsers(haadafot) {
  var count = 0;
  var users = [];
  haadafot.forEach(el => {
     // console.log("el",el);
      if(users.includes(el.userid) == false) {
          users[count] = el.userid;
          count++;
      }
  });
  console.log("users",users);
  var tempUsers = [];
  for(var i =0; i<users.length;i++) {
      tempUsers[i] = users[i];
      }
      var tempoUsers = [];
      for(var i=0;i<users.length;i++) {
          tempoUsers[i] = 0;
      }

      haadafot.forEach(el => {
      //    console.log("userid",el.userid);
          const isEquel = (element) => element == el.userid;
        var index = tempUsers.findIndex(isEquel);
     //   console.log("index",index);
        var hefresh = el.endDay - el.startDay;
      //  console.log("hefrhes", hefresh);
          tempoUsers[index] = tempoUsers[index] + hefresh;
      });
   //   console.log("tempoUsers",tempoUsers);
     // tempoUsers.sort();
     var usersSorted = [];
      for(var i=0;i<tempoUsers.length;i++){
          usersSorted[i] = tempoUsers[i];
      }
      usersSorted.sort();
      var userPoirity = [];
    //  console.log("userSorted",usersSorted);
      for(var i=0;i<usersSorted.length;i++) {
          const value = (element) => element == usersSorted[i];
          const index = tempoUsers.findIndex(value);
          userPoirity[i] = users[index];
          tempoUsers[i] = 100000;
      }
      return userPoirity;
  
}


async function getPiorityDays(haadafot,occupiedDay) {
  // var haadafot;
  // for(var i=0;i<results.length;i++) {
  //   haadafot[i] = results[i];
  // }
  var counter = Array.apply(null, Array(31)).map(function (x, i) { return 0; });
  //  console.log("counter",counter);
  //  console.log("haadafot",haadafot);
    haadafot.forEach(el => {
        let date1 = new Date(el.begindate)
        let date2 = new Date(el.enddate)
        el.startDay = date1.getDate();
        el.endDay = date2.getDate();
     //   console.log(el.startDay,",",el.endDay);
        for(var i = el.startDay;i<=el.endDay;i++) {
            counter[i]++;
        }
       
    });
    var tempCounter = counter;
    var tempo = [];
    for(var i=0;i<tempCounter.length;i++){
       tempo[i] = tempCounter[i];
    }
    //console.log("tempo",tempo);
    var newArray = tempo.sort();
    //console.log("newArray",newArray);
    var newCounter = [];
    newArray[0] = -1;
    //console.log("tempCounter",tempCounter);
    for(var i=1;i<newArray.length;i++) {
        for(var j=1;j<tempCounter.length;j++) {
            if(newArray[i] == tempCounter[j]) {
             //   console.log(newArray[i],"",tempCounter[j]);
                newCounter[i-1] = j;
                tempCounter[j]= -1;
                j=tempCounter.length;
            }
        }
    }
    
  for(var i=0;i<occupiedDay.length;i++) {
    var valueToDelete = occupiedDay[i];
    var index = newCounter.indexOf(valueToDelete);
    if (index !== -1) newCounter.splice(index, 1);
  }
  console.log("newcounter",newCounter);
    return newCounter;

}


module.exports = getPiority;