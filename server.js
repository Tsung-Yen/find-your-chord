let express = require("express");
let cookieParser = require("cookie-parser");
let app = express();

app.use(express.static("public"));
app.use(express.static("file"));
app.use("/static",express.static("public"));
app.use(require('body-parser').json());         //解析來自body的response
app.use(cookieParser("xxx"));


//render template(以下六個路由)
app.get("/",(req,res)=>{
    res.render("index");
});
app.get("/melody",(req,res)=>{
    res.sendFile(__dirname + "/public/melody.html");
});
app.get("/model",(req,res)=>{
    res.sendFile(__dirname + "/public/model.html");
});
app.get("/dictionary",(req,res)=>{
    res.sendFile(__dirname + "/public/dictionary.html");
});
app.get("/list",(req,res)=>{
    res.sendFile(__dirname + "/public/list.html");
});
app.get("/sign",(req,res)=>{
    res.sendFile(__dirname + "/public/sign.html");
});

//資料搜尋API(四個路由)
let search = require("./routes/search");
app.use('/',search);

//會員API(四個路由)
let user = require("./routes/user");
app.use("/",user);

//儲存會員音檔API
let audio = require("./routes/userstory");
app.use("/",audio); 

app.listen(8000,()=>{
    console.log("Server Started");
});