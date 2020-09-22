const getDetails = require("./getDetails");

function getToranotItemForFronted(dbo,elements) {
return new Promise(async (resolve) =>  {
    var temp = [];
    for(const element of elements) {
        var _id = element.idUser;
        // console.log("foreach id" , _id);
        
       const userDetails = await getDetails(dbo,_id);
        if(userDetails != null) {
      //  console.log("userDetails" , userDetails);
        var tempi = {
            _id: element._id,
            date: element.date,
            toran : element.toran,
            userDetails : userDetails,
            availableForExchange: element.availableForExchange,
            userStatus: element.userStatus
        }
        temp.push(tempi)
     }
    }                     
        // console.log("finsihforeach",temp);
         resolve(temp);
    });

}

module.exports = getToranotItemForFronted;