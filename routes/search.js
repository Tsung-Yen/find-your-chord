const { json } = require("express");
let express = require("express");
let router = express.Router();
let db_chord = require("../model/getdb");

router.route("/api/library/:chord")
    .get((req,res)=>{
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
        try{
            db_chord.single(chord, (err,result,fields)=>{
                if(err) throw err;
                if (result && result.length != 0){
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
                res.send(jsonData);
            });
        }catch(e){
            console.log(e);
            return;
        }
    });

router.route("/api/classify/")
    .get((req, res)=>{
        let type = req.query["type"];
        let chord = req.query["chord"];
        let jsonData = {};
        function removeDuplicates(data){   //將不同和弦但相同數量組成因音的和弦變成一個
            return [...new Set(data)];
        }
        try{
            db_chord.classify(type, (err,result,fields)=>{
                if(err) throw err;
                if(result && result.length != 0){
                    let resultLength = result.length;
                    let unFiltList = []
                    for(let i=0;i<resultLength;i++){
                        unFiltList.push(result[i]["chord"].replace("sharp","#")
                        .replace("sharp","#").replace("aug","+").replace("aug","+"));
                    }
                    let filtData = removeDuplicates(unFiltList);
                    jsonData = filtData;
                }else{
                    jsonData = {
                        "error":true,
                        "message":"沒有輸入的資料"
                    }
                }
                res.send(jsonData);
            });
        }catch(e){
            console.log(e);
            return;
        }
    });

router.route("/api/model")  //模板和弦
    .all((req, res)=>{
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
            let data = [string1, string2, string3, string4, string5, string6];
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
            let sqlString = sort(filtData);
            try{
                db_chord.modelSearch_finger(sqlString, (err, result, fields)=>{
                    if (err) throw err;
                    if(result && result.length!=0){
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
                    res.send(response);
                });
            }catch(e){
                console.log(e);
                return;
            }
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
        }else if(req.method == "GET" && keyword != null){   //模板和弦選單標題
            let limitNum = 12;
            if(keyword == "B" || keyword == "E"){
                limitNum = 6;
            }
            db_chord.modelSearch_keyword(keyword,limitNum, (err,result,fields)=>{
                if (err) throw err;
                try{
                    if(result && result.length!=0){
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
                    }else{
                        response = {
                            "error":true,
                            "message":"沒有此和弦"
                        }
                    }
                    res.send(response);
                }catch(e){
                    console.log(e);
                    return;
                }
            });
        }else if(req.method == "GET" && chord != null){
            try{
                db_chord.modelSearch_chord(chord, (err,result,fields)=>{
                    if(result && result.length!=0){
                        let id = result[0]["id"];
                        let chord = result[0]["chord"];
                        let contain = result[0]["contain"];
                        contain = contain.split(",");
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
                    res.send(response);
                });
            }catch(e){
                console.log(e);
                return;
            }
        }else{
            res.send({
                "error":true,
                "message":"伺服器錯誤"
            },400);
        }
    });

router.route("/api/search") //關鍵字搜尋
    .get((req,res)=>{
        let jsonData = []
        let tempList = []
        try{
            db_chord.keywordSearch("",(err,result,fields)=>{
                if(result && result.length!=0){
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
                res.send(jsonData);
            });
        }catch(e){
            console.log(e);
            return;
        }

    });
module.exports = router;
    
    
   

