//分類標題(三個頁面都相同)
function flagClick(){
    let searchChordPage = document.getElementById("search-chord-page");
    let guitarModel = document.getElementById("guitar-model");
    let chordDictionary = document.getElementById("chord-dictionary");
    searchChordPage.addEventListener("click",()=>{
        location.href="/search";
    });
    guitarModel.addEventListener("click",()=>{
        alert("model");
    });
    chordDictionary.addEventListener("click",()=>{
        location.href="/dictionary";
    });
}

//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    flagClick();            //載入分類標點擊事件
}