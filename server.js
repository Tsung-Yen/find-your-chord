let express = require("express");
let app = express();
app.use(express.static("public"));
app.use(express.static("file"));
app.use("/static",express.static("public"));

//連接mysql DB
let mysql = require("mysql");
let pool = mysql.createPool({
    connectionLimit : 3,
    host            : "yan-free-version.cv7r0cgdkgoj.us-east-2.rds.amazonaws.com",
    user            : "Yanxr",
    password        : "Bk55687ee1",
    database        : "guitarchord"
})

app.get("/",(req,res)=>{
    res.render("index");
});

app.get("/api/library/:chord",(req,res)=>{
    //取得搜尋和弦
    let chord = req.params.chord;
    let jsonData = {
        "type":"null",
        "data":[]
    }
    //資料庫搜尋
    let sql = "select * from chordlibrary where chord = "+"'"+chord+"';"
    pool.query(sql,(err,result,fields)=>{
        if(err) throw err;
        if(result && result != ""){
            for(let i=0;i<result.length;i++){
                let id = result[i]["id"];
                let type = result[i]["type"];
                let chordName = result[i]["chord"];
                let image = result[i]["image"];
                let quickSound = result[i]["quicksound"];
                let slowSound = result[i]["slowSound"];
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
        res.send(jsonData);
    });
});

app.get("/api/classify/:page",(req,res)=>{
    let page = req.params.page;
    let type = req.query["type"];
    let jsonData = {
        "type":"null",
        "maxpage":"null",
        "nextpage":"null",
        "data":[]
    }
    let sql = "select * from chordlibrary where type = "+"'"+type+"'";
    pool.query(sql,(err,result,fields)=>{
        if (err) throw err;
        if(result && result != "" && page != null){
            let limit = (page-1)*6
            let startNum = null;
            let endNum = null;
            jsonData["maxpage"] = Math.ceil(result.length/6);
            if(page <= 1){
                startNum = 0;
                if(result.length > limit){
                    endNum = 6;
                    jsonData["nextpage"] = Number(page)+1;
                }else{
                    endNum = result.length;
                }
            }else if(page > 1){
                startNum = limit;
                if(result.length > limit+6){
                    endNum = startNum + 6;
                    jsonData["nextpage"] = Number(page)+1;
                }else{
                    endNum = result.length;
                }
            }
            for(let i=startNum;i<endNum;i++){
                let id = result[i]["id"];
                let type = result[i]["type"];
                let chordName = result[i]["chord"];
                let image = result[i]["image"];
                let quickSound = result[i]["quicksound"];
                let slowSound = result[i]["slowSound"];
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
        res.send(jsonData);
    });
});

app.listen(3000,()=>{
    console.log("Server Started");
});