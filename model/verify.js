let currentUser = {}    //字典存放使用者名稱key
module.exports = {
    encryption: (id, name, email)=>{  //save user information to dict & keyname == name 
        currentUser[name] = {
            "id":id,
            "name":name,
            "email":email
        }
        return true;
    },
    verifyUser: (keyname)=>{
        if(currentUser.hasOwnProperty(keyname)){
            return {"ok":true,"info":{
                "id":currentUser[keyname]["id"],
                "name":currentUser[keyname]["name"],
                "email":currentUser[keyname]["email"]
            }};
        }else{
            return false;
        }
    }
}
