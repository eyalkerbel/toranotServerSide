console.log("script.js");

const MongoClient = require("mongodb").MongoClient;
const url =
    "mongodb+srv://nemoserver:DobyRs51kbIdc2YU@cluster0-qds1b.azure.mongodb.net/test?retryWrites=true&w=majority";
    console.log("scripts");
MongoClient.connect(
    url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    function (err, db) {
        if (err) throw err;
        var dbo = db.db("newmaindb");
        dbo.collection("haadafotthismonth").rename("haadafottest");
    }
);
