const express = require("express");
const cors=require('cors');
const app = express();
const MongoClient = require("mongodb").MongoClient;
//const url = "mongodb+srv://nemoserver:DobyRs51kbIdc2YU@cluster0-qds1b.azure.mongodb.net/test?retryWrites=true&w=majority";
//const url = "mongodb+srv://admin-eyal:test123@cluster0-mfmo8.mongodb.net/test?retryWrites=true&w=majority";
const url = "mongodb+srv://admin-eyal:test123@cluster0-mfmo8.mongodb.net/toranot?";
const jwt = require("jsonwebtoken");
const checkUser = require("./modules/checkUser.js");
const getThisMonthsToranuts = require("./modules/getThisMonthsToranuts.js");
const getNextMonthsToranuts = require("./modules/getNextMonthsToranuts.js");
const getAllThisMonthsToranuts = require("./modules/getAllThisMonthsToranuts");
const createUser = require("./modules/createUser.js");
const getHaadafot = require("./modules/getHaadafot.js");
const setHaadafot = require("./modules/setHaadafot.js");
const getUsersAndToranuts = require("./modules/getUsersAndToranuts");
const setToranutThisMonth = require("./modules/setToranutThisMonth");
const deleteToranutThisMonth = require("./modules/deleteToranutThisMonth")
const setToranutNextMonth = require("./modules/setToranutNextMonth");
const deleteToranutNextMonth = require("./modules/deleteToranutNextMonth");
const getPersonData = require("./modules/getPersonData");
const register = require("./modules/register");
const getHaadafotByUser = require("./modules/getHaadafotByUser");
const getAllHaadafot = require("./modules/getAllHaadafot");
const getPiority = require("./modules/getPiority");
const getPiorityByUser = require("./modules/getPiorityByUser");
const sendMessage = require("./modules/sendMessage");
const getMessage = require("./modules/getMessage");
const getNotifaction = require("./modules/getNotifaction")
const addTotanotChange = require("./modules/addToranotChange");
const getExchangesAndTornot =  require("./modules/getExchangesAndTornot");
const approveExchange = require("./modules/approveExchange");
const getExchangeToApprove = require("./modules/getExchangeToApprove");
const updateExchangeAnswer = require("./modules/updateExchangeAnswer");
const SendMessageAgain = require("./modules/SendMessageAgain");
const sendStatusShmirot = require("./modules/sendStatusShmirot");
//middleware for json
app.use(express.json());
//middleware for allowing fetch from different port 
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers","X-Requested-With, content-type, Authorization");
   res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});
app.use(cors({origin:true,credentials: true}));
app.use(express.static(__dirname + '/public'));

//logs in



app.post("/api/checkuser", (req, res) => {
  console.log("hi");
  console.log(req.body);
  console.log('dsnds');

  checkUser(url, MongoClient, req, res);
});
app.post("/api/registeruser", (req,res) => {
  console.log("registekxkr");
register(url,MongoClient,req,res);
});
//not finished create user
app.post("/api/createuser", (req, res) => {
  console.log("hi");
  createUser(url, MongoClient, req, res);
});

//gets this months toranuts and verifies
app.post("/api/getthismonthstoranuts", (req, res) => {
  getThisMonthsToranuts(url, MongoClient, req, res);
});
app.post("/api/getpioritybyuser", (req, res) => {
  console.log("getpioritybyuserindex");
  getPiorityByUser(url, MongoClient, req, res);
});

app.post("/api/getpersondata", (req,res) => {
  getPersonData(url,MongoClient,req,res);
});

app.post("/api/settoranutthismonth", (req, res) => {
  console.log("settoranutthismonth");
  setToranutThisMonth(url, MongoClient, req, res);
});

app.post("/api/getallhaadafot", (req,res) => {
  getAllHaadafot(url,MongoClient,req,res);
});

app.post("/api/deletetoranutthismonth", (req, res) => {
  console.log(123)
  deleteToranutThisMonth(url, MongoClient, req, res);
});
app.post("/api/settoranutnextmonth", (req, res) => {
  setToranutNextMonth(url, MongoClient, req, res);
});

app.post("/api/deletetoranutnextmonth", (req, res) => {
  console.log(123)
  deleteToranutNextMonth(url, MongoClient, req, res);
});

app.post("/api/getpiority" , (req,res) => {
  getPiority(url,MongoClient,req,res);
});

app.post("/api/gethaadafotbyuser", (req,res) => {
  console.log("gethaadafotbyuser");
  getHaadafotByUser(url,MongoClient,req,res);
});

app.post("/api/getallthismonthstoranuts", (req, res) => {
  getAllThisMonthsToranuts(url, MongoClient, req, res);
});

app.post("/api/getnextmonthstoranuts", (req, res) => {
  getNextMonthsToranuts(url, MongoClient, req, res);
});

app.post("/api/gethaadafot", (req, res) => {
  getHaadafot(url, MongoClient, req, res);
});

app.post("/api/sethaadafot", (req, res) => {
  setHaadafot(url, MongoClient, req, res);
});

app.post("/api/getusersandtoranuts", (req, res) => {
  getUsersAndToranuts(url, MongoClient, req, res);
});

app.post("/api/sendmessage", (req,res) => {
  sendMessage(url,MongoClient,req,res);
});

app.post("/api/getmessagebyid", (req,res) => {
  console.log("index get massage");
  getMessage(url,MongoClient,req,res);
});

app.post("/api/getnotifaction" , (req,res) => {
  getNotifaction(url,MongoClient,req,res);
});

app.post("/api/addtoranotchange", (req,res) => {
  console.log("addtoranotchange");
  addTotanotChange(url,MongoClient,req,res);
});
app.post("/api/getexchangesandtoranot", (req,res) => {
  getExchangesAndTornot(url,MongoClient,req,res);
});

app.post("/api/approveexchange" , (req,res) => {
  console.log("approveexchangee");
  approveExchange(url,MongoClient,req,res);
});

app.post("/api/getexchangeapprove" , (req,res) => {
  console.log("getexchangeapprove");
  getExchangeToApprove(url,MongoClient,req,res);
});
app.post("/api/updateexchangemanager" , (req,res) => {
  console.log("updateFromManager");
  updateExchangeAnswer(url,MongoClient,req,res);
});

app.post("/api/sendmessageagain" , (req,res) => {
  SendMessageAgain(url,MongoClient,req,res);
});
app.post("/api/sendstatusshmirot" , (req,res) => {
  sendStatusShmirot(url,MongoClient,req,res);
});

port = process.env.PORT || 5000;

app.listen(port, console.log("server started on: " + port));


app.get("/",function(req,res) {
console.log("hii ")
});