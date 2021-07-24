let express = require("express");
let app = express();
app.use(express.static("public"));
app.use(express.static("file"));
app.use("/static",express.static("public"));

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

app.get("/dictionary",(req,res)=>{
    res.sendFile(__dirname + "/public/dictionary.html");
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

app.get("/api/classify/:page",(req,res)=>{
    let page = req.params.page;
    let type = req.query["type"];
    let chord = req.query["chord"];
    let jsonData = {
        "type":"null",
        "maxpage":"null",
        "nextpage":"null",
        "data":[]
    }
    //串接分類API標籤(非單一)
    if(type != null && chord != null && page == null){
        let sql = "select * from chordlibrary where type = "+"'"+type+"'"+" and chord = "+"'"+chord+"'";
        pool.getConnection((err,connection)=>{
            connection.query(sql,(err,result,fields)=>{
                if (err) throw err;
                if(result && result != ""){
                    function removeDuplicates(data){        //將不同和弦但相同數量組成因音的和弦變成一個
                        return [...new Set(data)]
                    }
                    let filtList = []
                    for(let i=0;i<result.length;i++){
                        let chord = result[i]["chord"];
                    }
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
                }
            });
        });
    }
    
    pool.query(sql,(err,result,fields)=>{
        if (err) throw err;
        if(result && result != "" && page != null){

            // let limit = (page-1)*6
            // let startNum = null;
            // let endNum = null;
            // jsonData["maxpage"] = Math.ceil(result.length/6);
            // if(page <= 1){
            //     startNum = 0;
            //     if(result.length > limit){
            //         endNum = 6;
            //         jsonData["nextpage"] = Number(page)+1;
            //     }else{
            //         endNum = result.length;
            //     }
            // }else if(page > 1){
            //     startNum = limit;
            //     if(result.length > limit+6){
            //         endNum = startNum + 6;
            //         jsonData["nextpage"] = Number(page)+1;
            //     }else{
            //         endNum = result.length;
            //     }
            // }
            // for(let i=startNum;i<endNum;i++){
            //     let id = result[i]["id"];
            //     let type = result[i]["type"];
            //     let chordName = result[i]["chord"];
            //     let image = result[i]["image"];
            //     let quickSound = result[i]["quicksound"];
            //     let slowSound = result[i]["slowSound"];
            //     let data = {
            //         "id":id,
            //         "type":type,
            //         "chord":chordName,
            //         "image":image,
            //         "quicksound":quickSound,
            //         "slowsound":slowSound
            //     }
            //     jsonData["type"] = type;
            //     jsonData["data"].push(data);
            // }
        }else{
            jsonData = {
                "error":true,
                "message":"沒有輸入的資料"
            }
        }
        res.send(jsonData);
    });
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
app.listen(3000,()=>{
    console.log("Server Started");
});