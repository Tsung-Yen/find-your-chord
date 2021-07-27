//取得網址中的訊息(從/dictionary觸發的分類)
let urlParams = new URLSearchParams(window.location.search);
let queryString = urlParams.get("type");
let api_url = "/api/classify/?type="+queryString;
let chordTitle = document.querySelector(".chord-title").textContent=queryString;
function createLabel(){
    fetch(api_url).then((res)=>res.json()).then((result)=>{
        if (result["error"] == null && result != ""){
            let loadingImage = document.getElementById("loading").style.display="none";
            let chord_ul = document.getElementById("chord-ul");
            for(let i=0;i<result.length;i++){
                let chord_li = document.createElement("li");
                let chord_a = document.createElement("a");
                chord_a.textContent = result[i]+" 和弦";
                chord_li.append(chord_a);
                chord_ul.append(chord_li);
                mouse(chord_a);
            }
            //串接單一和弦點擊跳轉
            let allLink = document.getElementsByTagName("a");
            for(let i=3;i<allLink.length;i++){
                allLink[i].addEventListener("click",()=>{
                    let targetChord = allLink[i].innerText.replace(" 和弦","");
                    targetChord = targetChord.replace("#","sharp").replace("#","sharp")
                    .replace("+","aug").replace("M","maj").replace("M","maj");
                    location.href = "/search?chord="+targetChord;
                });
            }
        }
    });
}
//回到分類頁面
function backToDict(){
    let back = document.querySelector(".back-button");
    back.addEventListener("click",()=>{
        location.href = "/dictionary";
    });
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
//分類標題(四個個頁面都相同)
function flagClick(){
    let searchChordPage = document.getElementById("search-chord-page");
    let guitarModel = document.getElementById("guitar-model");
    let chordDictionary = document.getElementById("chord-dictionary");
    let menberSystem = document.getElementById("signing");
    searchChordPage.addEventListener("click",()=>{
        location.href="/search";
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

//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    flagClick();            //載入分類標點擊事件
    createLabel();          //新增使用者選擇類別的和弦內容
    backToDict()            //回到分類頁面
}