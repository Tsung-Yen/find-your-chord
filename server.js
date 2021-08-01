const e = require("express");
let express = require("express");
let app = express();
app.use(express.static("public"));
app.use(express.static("file"));
app.use("/static",express.static("public"));
app.use(require('body-parser').json());         //解析來自body的response

//連接mysql DB
require("dotenv").config();
let mysql = require("mysql");
let pool = mysql.createPool({
    host                : process.env["DB_HOST"],
    user                : process.env["DB_USER"],
    password            : process.env["DB_PASSWORD"],
    database            : process.env["DB_NAME"],
    waitForConnections  : true,
    connectionLimit     : 5
})

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/search",(req,res)=>{
    res.sendFile(__dirname + "/public/search.html");
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

app.get("/api/library/:chord",(req,res)=>{
    //1.取得搜尋和弦(對資料做處理)
    let chord = req.params.chord;
    //輸入大寫M需轉換為maj再進資料庫搜尋
    if(chord.includes("M")){
        if(chord[chord.length -1] == "M"){
            chord = chord.replace("M","")
        }else{
            chord = chord.replace("M7","maj7").replace("M9","maj9")
            .replace("M11","maj11").replace("M13","maj13");
        }
    }
    //輸入包含#則需替換為sharp
    chord = chord.replace("%23","sharp");
    //輸入包含+則需替換為plus
    chord = chord.replace("+","aug");

    let jsonData = {
        "type":"null",
        "data":[]
    }
    //資料庫搜尋
    let sql = "select * from chordlibrary where chord = "+"'"+chord+"';"
    pool.getConnection((err, connection)=>{
        connection.query(sql,(err,result,fields)=>{
            if (err) throw err;
            if(result && result != ""){
                for(let i=0;i<result.length;i++){
                    let id = result[i]["id"];
                    let type = result[i]["type"];
                    let chordName = result[i]["chord"];
                    let image = result[i]["image"];
                    let quickSound = result[i]["quicksound"];
                    let slowSound = result[i]["slowsound"];
                    let data = {
                        "id":id,
                        "type":type,
                        "chord":chordName,
                        "image":image,
                        "quicksound":quickSound,
                        "slowsound":slowSound
                    }
                    jsonData["type"] = type;
                    jsonData["data"].push(data);
                }
            }else{
                jsonData = {
                    "error":true,
                    "message":"沒有輸入的資料"
                }
            }
            connection.release();
            res.send(jsonData);
        });
    });
});

app.get("/api/classify/",(req,res)=>{
    let type = req.query["type"];
    let chord = req.query["chord"];
    let jsonData = {};
    function removeDuplicates(data){   //將不同和弦但相同數量組成因音的和弦變成一個
        return [...new Set(data)];
    }
    //串接分類API標籤(非單一)
    if(type != null && chord == null){
        let sql = "select * from chordlibrary where type = "+"'"+type+"'";
        pool.getConnection((err,connection)=>{
            connection.query(sql,(err,result,fields)=>{
                if (err) throw err;
                if((result) && result != ""){
                    let resultLength = result.length;
                    let unFiltList = []
                    for(let i=0;i<resultLength;i++){
                        unFiltList.push(result[i]["chord"].replace("sharp","#")
                        .replace("sharp","#").replace("aug","+").replace("aug","+"));
                    }
                    let filtData = removeDuplicates(unFiltList);
                    jsonData = filtData;
                    connection.release();
                }else{
                    jsonData = {
                        "error":true,
                        "message":"沒有輸入的資料"
                    }
                }
                res.send(jsonData);
            });
        });
    }
});

app.get("/api/search",(req,res)=>{
    let jsonData = []
    let tempList = []
    let sql = "select * from chordlibrary";
    pool.getConnection((err,connection)=>{
        connection.query(sql,(err,result,fields)=>{
            if (err) throw err;
            if (result && result != ""){
                for(let i=0;i<result.length;i++){
                    let chordName = result[i]["chord"];
                    tempList.push(chordName);
                }
                function removeDuplicates(data){        //將不同指形同樣組成音的和弦變成一個
                    return [...new Set(data)]
                }
                tempList = removeDuplicates(tempList);
                for(let i=0;i<tempList.length;i++){
                    let fixData = tempList[i].replace("sharp","#").replace("sharp","#");
                    let data = {
                        "chord":fixData
                    }
                    jsonData.push(data)
                }
            }else{
                jsonData = {
                    "error":true,
                    "message":"伺服器錯誤"
                }
            }
            connection.release();
            res.send(jsonData);
        });
    });
});

app.all("/api/model",(req,res)=>{
    let keyword = req.query["keyword"];
    let chord = req.query["chord"];
    let response;
    if(req.method == "POST" && keyword == null){
        let string1 = req.body["string1"];
        let string2 = req.body["string2"];
        let string3 = req.body["string3"];
        let string4 = req.body["string4"];
        let string5 = req.body["string5"];
        let string6 = req.body["string6"];
        if(string1 && string2 && string3 && string4 && string5 && string6){
            let data = [
                string1,
                string2,
                string3,
                string4,
                string5,
                string6
            ];
            //將靜音的資料及重複的音階過濾
            for(let i=0;i<data.length;i++){
                for(let j=data.length-1;j>i;j--){
                    if(data[i]==data[j] || data[i]=="mute"){
                        data[i] = "";
                    }else if(data[j]=="mute"){
                        data[j] = "";
                    }
                }
            }
            //移除過濾後的資料
            for(let i=0;i<data.length;i++){
                if(data[i] == ""){
                    data.splice(i,1)
                }
            }
            let filtData = [];
            //將根音擺在第一個(在做排序)
            for(let i=data.length-1;i>=0;i--){
                if(data[i] != ""){
                    filtData.push(data[i]);
                }
            }
            let sqlString = sort(filtData);         //資料庫搜尋關鍵字    
            let sql = "select chord from model where contain = "+"'"+sqlString+"'"+" limit 1";               
            pool.getConnection((err,connection)=>{
                connection.query(sql,(err,result,fields)=>{
                    if (err) throw err;
                    if(result && result!=""){
                        response = {
                            "ok":true,
                            "chord":result[0]["chord"].replace("sharp","#")
                        }
                    }else{
                        response = {
                            "error":true,
                            "message":"找不到此和弦(是否有靜音非根音的低音)"
                        }
                    }
                    connection.release();
                    res.send(response);
                });
            });          
            function sort(list){
                //將根音保留，數字大的靠右
                for(let i=1;i<list.length;i++){
                    for(let j=i+1;j<list.length;j++){
                        if(list[i] > list[j]){
                            let store = list[i];
                            list[i] = list[j];
                            list[j] = store;
                        }
                    }
                }
                let sqlString = "";
                for(let i=0;i<list.length;i++){
                    sqlString = sqlString + list[i];
                }
                return sqlString;
            }
            
        }else{
            res.send({
                "error":true,
                "message":"弦不得為空值"
            });
        }
    }else if(req.method == "GET" && keyword != null){   //模板和弦選單標題
        pool.getConnection((err,connection)=>{
            let sql = "select * from model where chord like"+"'%"+keyword+"%' limit 12";
            connection.query(sql,(err,result,fields)=>{
                if (err) throw err;
                if(result && result!= ""){
                    response = {
                        "ok":true,
                        "data":[]
                    }
                    for(let i=0;i<result.length;i++){
                        let id = result[i]["id"];
                        let chord = result[i]["chord"].replace("sharp","#");
                        let contain = result[i]["contain"];
                        data = {
                            "id":id,
                            "chord":chord,
                            "contain":contain
                        }
                        response["data"].push(data);
                    }
                    connection.release();
                }else{
                    response = {
                        "error":true,
                        "message":"沒有此和弦"
                    }
                }
                res.send(response);
            });
        });
    }else if(req.method == "GET" && chord != null){
        pool.getConnection((err,connection)=>{
            let sql = "select * from model where chord = "+"'"+chord+"' limit 1";
            connection.query(sql,(err,result,fields)=>{
                if (err) throw err;
                if(result && result != ""){
                    let id = result[0]["id"];
                    let chord = result[0]["chord"];
                    let contain = result[0]["contain"];
                    response = {
                        "ok":true,
                        "id":id,
                        "chord":chord,
                        "contain":contain
                    }
                }else{
                    response = {
                        "err":true,
                        "message":"沒有此和弦"
                    }
                }
                connection.release();
                res.send(response);
            });
        });
    }else{
        res.send({
            "error":true,
            "message":"伺服器錯誤"
        },400);
    }
});

app.post("/api/signin",(req,res)=>{
    let data;
    if(req.method == "POST"){
        let account = req.body["account"];
        let password = req.body["password"];
        if(account  && password){
            let sql = "select * from menber where email = "+"'"+account+"'"+" and password = "+"'"+password+"'"+" limit 1";
            pool.getConnection((err,connection)=>{
                connection.query(sql,(err,result,fields)=>{
                    if (err) throw err;
                    if(result && result != ""){
                        data = {
                            "ok":true,
                            "message":"登入成功"
                        }
                    }else{
                        data = {
                            "error":true,
                            "message":"帳號或密碼輸入錯誤"
                        }
                    }
                    connection.release();
                    res.send(data);
                });
            });
        }else{
            data = {
                "error":true,
                "message":"登入失敗"
            }
            res.send(data);
        }
    }   
    
});

app.post("/api/signup",(req,res)=>{
    let data;
    if(req.method == "POST"){
        let name = req.body["name"];
        let account = req.body["account"];
        let password = req.body["password"];
        if(name && account && password){
            let sql = "select * from menber where name = "+"'"+name+"'"+" or email = "+"'"+account+"'"+" limit 1"; 
            pool.getConnection((err,connection)=>{
                connection.query(sql,(err,result,fields)=>{
                    if (err) throw err;
                    if(result && result != ""){
                        data = {
                            "err":true,
                            "message":"帳號已被註冊"
                        }
                    }else{
                        sql = "insert into menber(name,email,password,image) values("+"'"+name+"'"+",'"+account+"'"+",'"+password+"',"+"'"+" "+"'"+")";
                        connection.query(sql,(err,result,fields)=>{
                            if (err) throw err; 
                        });
                        connection.commit();
                        data = {
                            "ok":true,
                            "message":"註冊成功"
                        }
                    }
                    connection.release();
                    res.send(data);
                });
            });
        }else{
            data = {
                "error":true,
                "message":"註冊失敗"
            }
            res.send(data);
        }
    }
});

app.listen(8000,()=>{
    console.log("Server Started");
});