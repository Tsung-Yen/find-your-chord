let pool = require("../db"); //引入 Database
require("dotenv").config();

module.exports = {
//Search Chord
    single: (req, callback) =>{
        try{
            let sql = "select * from chordlibrary where chord = "+"'"+req+"';"
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e) {
            console.log(e);
            return;
        }
    },
    classify: (req, callback) =>{
        try{
            let sql = "select * from chordlibrary where type = "+"'"+req+"'";
            pool.getConnection((err, connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    modelSearch_finger: (req, callback) =>{
        try{
            let sql = "select chord from model where contain = "+"'"+req+"'"+" limit 1";
            pool.getConnection((err, connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    modelSearch_keyword: (keyword, limitNum, callback) =>{  //模板和弦
        try{
            let sql = "select * from model where chord like"+"'"+keyword+"%' limit "+limitNum;
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    modelSearch_chord: (chord, callback)=>{
        try{
            let sql = "select * from module where chord = "+"'"+chord+"' limit 1";
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    keywordSearch: (req, callback)=>{
        try{
            let sql = "select * from chordlibrary";
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },

//==========================================================================
//User (Menber System)
    signin: (account, password, callback)=>{
        try{
            let sql = "select * from menber where email = "+"'"+account+"'"+" and password = "+"'"+password+"'"+" limit 1";
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    signup_check: (username, account,callback)=>{    //檢查是否重複註冊
        try{
            let sql = "select * from menber where name = "+"'"+username+"'"+" or email = "+"'"+account+"'"+" limit 1"; 
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{ 
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    signup_insert: (username, account, password, callback)=>{    //否，寫入會員資訊
        try{
            let sql = "insert into menber(name,email,password) values("+"'"+username+"'"+",'"+account+"'"+",'"+password+"'"+")";
            pool.getConnection((err, connection)=>{
                if(err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{ 
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
//==========================================================================
//Audio (save, delete, get)
    save_check: (req, callback)=>{
        try{
            let  ap = "'";
            let sql = "select * from menberaudio where username= "+ap+req[0]+ap+" and chords= "+ap+req[1]+ap+" and type= "+ap+req[2]+ap;
            pool.getConnection((err,connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    save_insert: (req, callback)=>{
        try{
            let  ap = "'";
            let sql = "insert into menberaudio(username,chords,type) values("+ap+req[0]+ap+","+ap+req[1]+ap+","+ap+req[2]+ap+")";
            pool.getConnection((err,connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    audio_delete: (req, callback)=>{
        try{
            let ap = "'";
            let sql = "delete from menberaudio where username="+ap+req[0]+ap+" and chords="+ap+req[1]+ap+" and type="+ap+req[2]+ap;
            pool.getConnection((err,connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    },
    audio_get: (req,callback)=>{
        try{
            let ap = "'";
            let sql = "select * from menberaudio where username="+"'"+req+"'";
            pool.getConnection((err,connection)=>{
                if (err) throw err;
                try{
                    return connection.query(sql, callback);
                }finally{
                    pool.releaseConnection(connection);
                }
            });
        }catch(e){
            console.log(e);
            return;
        }
    }
}