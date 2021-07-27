//分類標題(四個頁面都相同)
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
}