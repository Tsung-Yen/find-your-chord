let express = require("express");
let router = express.Router();
let verify = require("../model/verify");
let db_audio = require("../model/getdb");

router.route("/api/audio")
    .all((req,res)=>{
        if(req.method == "POST"){
            let key = req.signedCookies["key"];
            let verifyUser = verify.verifyUser(key); 
            if(verifyUser != false){
                let audios = req.body["audios"];
                let audiosql = "";
                audios.forEach(audio=>{
                    audiosql = audiosql+audio+",";
                });
                let type = req.body["type"];
                if(audios && type){
                    let info = verifyUser["info"];
                    try{
                        db_audio.save_check([info["name"],audiosql,type], (err,result,fields)=>{
                            if(err) throw err;
                            if (result.length!=0){
                                res.send({"ok":true,"message":"exist"});
                            }else{
                                db_audio.save_insert([info["name"],audiosql,type], (err,result,fields)=>{
                                    if (err) throw err;
                                    res.send({"ok":true,"message":"insert success"})
                                });
                            }
                        });
                    }catch(e){
                        console.log(e);
                        return;
                    }
                }
            }else{
                res.send({"error":true,"message":"user signin yet"});
            }
        }else if(req.method == "DELETE"){
            let key = req.signedCookies["key"];
            let verifyUser = verify.verifyUser(key);
            if(verifyUser != false){
                let audios = req.body["audios"];
                let audiosql = "";
                audios.forEach(audio=>{
                    audiosql = audiosql+audio+",";
                });
                let type = req.body["type"];
                db_audio.audio_delete([verifyUser["info"]["name"],audiosql,type],(err,result,fields)=>{
                    if (err) throw err;
                    res.send({"ok":true});
                });
            }else{
                res.send({"error":true,"message":"server error"});
            }
        }else if(req.method == "GET"){
            let jsonData = {"data":[]}
            let key = req.signedCookies["key"];
            let verifyUser = verify.verifyUser(key);
            if(verifyUser != false){
                db_audio.audio_get(verifyUser["info"]["name"],(err,result,fields)=>{
                    if (err) throw err;
                    if(result && result.length != 0){
                        result.forEach(data=>{
                            let chord = data["chords"].split(",");
                            chord.pop();
                            let listData = {
                                "chords":chord,
                                "type":data["type"]
                            }
                            jsonData["data"].push(listData);
                            jsonData["ok"] = true;
                        });
                    }else{
                        jsonData = {"error":true,"message":"empty"}
                    }
                    res.send(jsonData);
                });
            }else{
                res.send({"error":true,"message":"user signin yet"});
            }
        }else{
            res.send({"error":true}),500;
        }
    });

module.exports = router;