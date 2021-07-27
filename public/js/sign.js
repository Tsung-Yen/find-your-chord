
//會員系統
let signinResult = document.querySelector(".signin_result");
let signupResult = document.querySelector(".signup_result");
let signinBar = document.querySelector(".signinBar");
let signupBar = document.querySelector(".signupBar");
//(登入)
function sigInSystem(){
    signinResult.addEventListener("click",()=>{
        signinBar.style.display = "none";
        signupBar.style.display = "block";
    });
    let sigInForm = document.getElementById("signin_form");
    sigInForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        let account = document.getElementById("signin_account").value;
        let password = document.getElementById("signin_password").value;
        let data = {
            "account":account,
            "password":password
        }
        let sigin_url = "/api/signin";
        fetch(sigin_url,{method:"POST"
        ,headers:{
            "Content-Type":"application/json"
        },body:JSON.stringify(data)}).then((res)=>res.json()).then((result)=>{
            if(result["ok"] == true){
                signinResult.innerText = result["message"];
                window.setTimeout(()=>{
                    location.href = "/";
                },500);
            }else{
                signinResult.innerText = result["message"];
            }
        });
    });
}
//(註冊)
function signUpSystem(){
    signupResult.addEventListener("click",()=>{
        signupBar.style.display = "none";
        signinBar.style.display = "block";
    });
    let signUpForm = document.getElementById("signup_form");
    signUpForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        let name = document.getElementById("signup_name").value;
        let account = document.getElementById("signup_account").value;
        let password = document.getElementById("signup_password").value;
        let data = {
            "name":name,
            "account":account,
            "password":password
        }
        let signUp_url = "/api/signup";
        fetch(signUp_url,{method:"POST",headers:{
            "Content-Type":"application/json"
        },body:JSON.stringify(data)}).then((res)=>res.json()).then((result)=>{
            if(result["ok"] == true){
                signupResult.innerText = result["message"]+" , 點此返回登入頁面";
            }else{
                signupResult.innerText = result["message"];
            }
        });

    });
}

//回到首頁
function backToIndex(){
    let title = document.querySelector(".navbar-header");
    title.addEventListener("click",()=>{
        location.href = "/";
    });
}
//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    backToIndex();      //回到首頁
    sigInSystem();      //會員系統(登入)
    signUpSystem();     //(註冊)
}