//分類標題(四個個頁面都相同)
function flagClick(){
    let index = document.querySelector(".navbar-header");
    let createChordPage = document.getElementById("create-chord-page");
    let guitarModel = document.getElementById("guitar-model");
    let chordDictionary = document.getElementById("chord-dictionary");
    let menberSystem = document.getElementById("signing");
    index.addEventListener("click",()=>{
        location.href="/";
    });
    createChordPage.addEventListener("click",()=>{
        location.href="/melody";
    });
    guitarModel.addEventListener("click",()=>{
        location.href="/model";
    });
    chordDictionary.addEventListener("click",()=>{
        location.href="/dictionary";
    });
    menberSystem.addEventListener("click",()=>{
        location.href="/sign";
    });
}
//檢查使用者狀態
function userStatus(){
    let api_url = "/api/status";
    fetch(api_url).then((res)=>res.json())
    .then((result)=>{
        if(result["ok"] == true){
            let sign = document.getElementById("signing");
            sign.remove();
            let newSign = document.createElement("div");
            newSign.className = "sign";
            newSign.id = "signout";
            newSign.innerText = "登出系統";
            let navBar = document.getElementById("navbar");
            navBar.append(newSign);
            signOut();
        }else return;
    });
}
//(登出)
function signOut(){
    let api_url = "/api/signout";
    let signout = document.getElementById("signout");
    signout.addEventListener("click",()=>{
        fetch(api_url,{method:"DELETE"})
        .then((res)=>res.json()).then((result)=>{
            if(result["ok"] == true){
                setTimeout(()=>{
                    location.reload();
                },600);
            }else return;
        });
    });
}
//分類標籤觸發
function labelClick(){
    let allTitle = document.getElementsByTagName("a");
    for(let i=3;i<allTitle.length;i++){
        mouse(allTitle[i]);
        allTitle[i].addEventListener("click",()=>{
            let type = allTitle[i].innerText;
            location.href = "/list?type="+type;
        });
    }
}

//mouse over & out
function mouse(p1){
    p1.addEventListener("mouseover",()=>{
        p1.style.color = "red";
    });
    p1.addEventListener("mouseout",()=>{
        p1.style.color = "black";
    });
}
//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    flagClick();            //載入分類標點擊事件
    labelClick();           //典籍分類標籤
    userStatus();           //檢查使用者狀態
}