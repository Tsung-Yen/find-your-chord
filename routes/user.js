let express = require("express");
let router = express.Router();
let db = require("../model/getdb");
let verify = require("../model/verify");


let currentUser = {}    //字典存放使用者名稱key
router.route("/api/status")
    .get((req, res)=>{
        let key = req.signedCookies["key"]; //get cookies keyname key
        let result = verify.verifyUser(key);
        if(result != false){
            res.send({"ok":true,"message":"已登入",});
        }else{
            res.send({"error":true,"message":"尚未登入會員"});
        }        
    });
router.route("/api/signin")
    .post((req,res)=>{
        let data;
        let account = req.body["account"];
        let password = req.body["password"];
        if(account  && password){
            try{
                db.signin(account, password, (err, result, fields)=>{
                    if(err) throw err;
                    if(result && result.length!=0){
                        let id = result[0]["id"];
                        let name = result[0]["name"];
                        let email = result[0]["email"];
                        verify.encryption(id, name, email);
                        res.cookie(    //send key to chrome
                            "key",name,
                            {
                               maxAge:600000,
                               signed:true,     //會將value加密
                               httpOnly:true
                            }
                        );
                        data = {"ok":true,"message":"登入成功"}
                    }else{
                        data = {"error":true,"message":"帳號或密碼輸入錯誤"}
                    }
                    res.send(data);
                });
            }catch(e){
                console.log(e);
                return;
            }
        }else{
            data = {"error":true,"message":"登入失敗"}
            res.send(data);
        }
    });
router.route("/api/signup")
    .post((req, res)=>{
        let name = req.body["name"];
        let account = req.body["account"];
        let password = req.body["password"];
        if(name && account && password){
            try{
                db.signup_check(name,account,(err,result,fields)=>{
                    if(err) throw err;
                    if(result && result.length!=0){
                        res.send({"error":true,"message":"帳號已被註冊"})
                    }
                    else{
                        db.signup_insert(name,account,password,(err,result,fields)=>{
                            if (err) throw err;
                            res.send({"ok":true,"message":"註冊成功"});
                        });
                    }
                });
            }catch(e){
                console.log(e);
                return;
            }
        }else{
            res.send({"error":true,"message":"註冊失敗"});            
        }
    });
router.route("/api/signout")
    .delete((req,res)=>{
        let data = null;
        let key = req.signedCookies["key"];
        let result = verify.verifyUser(key);
        if(result != false){
            res.clearCookie("key");
            data = {"ok":true,"message":"cookie is clear"}
        }else{
            data = {"error":true,"message":"未登入會員"}
        }
        res.send(data);
    });

module.exports = router;