//取得網址搜尋的訊息(透過網址進行搜尋)
let urlParams = new URLSearchParams(window.location.search);
let queryString = urlParams.get("chord");
if(queryString != null){
    callApi(queryString);
}
//關鍵字搜尋(正規搜尋for使用者)
let instantResultContainer = document.querySelector(".instant-search-result-container");
function searchBar(){
    let searchButton = document.querySelector(".search-button");
    let searchButtonClick = false;
    searchButton.addEventListener("click",()=>{
        if(searchButtonClick == false){
            searchButtonClick = true;
            let searchValue = document.querySelector(".search-spot").value;
            //使用者已確定搜尋隱藏推薦項目
            instantResultContainer.style.display = "none";
            callApi(searchValue);
            //重製搜尋紀錄(預防連續點擊)
            searchButtonClick = false;
        }
    });
}
//點擊搜尋輸入框顯示推薦項目
function showResultContainer(){
    let searchSpot = document.querySelector(".search-spot");
    searchSpot.addEventListener("click",()=>{
        instantResultContainer.style.display = "block";
    });
}
//呼叫api(並串上資料)
function callApi(value){
    if(value != null){
        //替換升記號變回sharp在進後端
        if(value.includes("#") == true){
            //可能會有兩個升記號
            value = value.replace("#","sharp").replace("#","sharp");
        }
        let container = document.querySelector(".part");
        container.innerHTML = ""; 
        let api_url = "/api/library/"+value;
        fetch(api_url).then((res)=>res.json()).then((result)=>{
            if(result != null && result["error"] != true){
                //隱藏空白位置
                let empty = document.querySelector(".empty").style.display="none";
                for(let i=0;i<result["data"].length;i++){
                    let id = result["data"][i]["id"];
                    let type = result["data"][i]["type"];
                    let chord = result["data"][i]["chord"];
                    let image = result["data"][i]["image"];
                    let quickSound = result["data"][i]["quicksound"];
                    let slowSound = result["data"][i]["slowsound"];

                    let item = document.createElement("div");
                    item.className = "item";
                    item.id = i+1;
                    let chordImage = document.createElement("img");
                    chordImage.src = image;
                    let soundBox = document.createElement("div");
                    soundBox.className = "sound-box";
                    let sound1 = document.createElement("div");
                    sound1.className = "audio-quick";
                    sound1.textContent = "normal";
                    let audio1 = document.createElement("audio");
                    audio1.src = quickSound;
                    let sound2 = document.createElement("div");
                    sound2.className = "audio-slow";
                    sound2.textContent = "seperate";
                    let audio2 = document.createElement("audio");
                    audio2.src = slowSound;
                    let audioClickBtn1 = document.createElement("img");
                    audioClickBtn1.className = "audio-button";
                    audioClickBtn1.src = "image/outline_play_circle_filled_black_24dp.png";
                    let audioClickBtn2 = document.createElement("img");
                    audioClickBtn2.className = "audio-button";
                    audioClickBtn2.src = "image/outline_play_circle_filled_black_24dp.png";
                    container.append(item);
                    item.append(chordImage);
                    item.append(soundBox);
                    soundBox.append(sound1);
                    soundBox.append(sound2);
                    sound1.append(audio1);
                    sound1.append(audioClickBtn1);
                    sound2.append(audio2);
                    sound2.append(audioClickBtn2);

                    //播放audio
                    sound1.addEventListener("click",()=>{
                        audio1.play();
                    });
                    sound2.addEventListener("click",()=>{
                        audio2.play();
                    });
                }
                //將搜尋框中的值換成使用者點擊的和弦
                let searchValue = document.querySelector(".search-spot");
                searchValue.value = value;
            }
        });
    }
}
//關鍵字搜尋建議
function searchBarRecoomand(){
    let search = document.querySelector(".search-spot");
    let searchResult = document.querySelector(".instant-search-result-container");
    let dbAllData = [];
    search.addEventListener("keyup",(event)=>{
        let searchString = event.target.value;
        searchString = searchString.charAt(0).toUpperCase() + searchString.slice(1);
        
        //處理好使用者輸入的值在進陣列
        if(searchString.includes("M") == true){
            if(searchString[searchString.length -1] == "M"){
                searchString = searchString.replace("M","");
            }else{
                searchString = searchString.replace("M7","maj7").replace("M9","maj9")
                .replace("M11","maj11").replace("M13","maj13");
            }
        }
        let filterChords = dbAllData.filter((chords)=>{
            return chords.chord.includes(searchString);
        });
        displayChords(filterChords);
    });

    //拉出API所有資料
    const loadChords = async()=>{
        try{
            const response = await fetch("/api/search");
            let data = await response.json();
            dbAllData = data;
        }catch (err){
            console.log(err)
        }
    }
    loadChords();

    const displayChords = (chords) => {
        
        const htmlString = chords.map((chords)=>{
            return `
            <li>
                <a href="#" class="instant-search-result">${chords.chord}</a>
            </li>
            `;
        }).join('');
        searchResult.innerHTML = htmlString;
        resultBarHref();
    }
    //套上搜尋結果連結
    function resultBarHref(){
        let allLink = document.getElementsByClassName("instant-search-result");
        let clickValue = null;
        for(let i=0;i<allLink.length;i++){
            allLink[i].addEventListener("click",()=>{
                //將搜尋框中的值換成使用者點擊的和弦
                let searchValue = document.querySelector(".search-spot");
                searchValue.value = allLink[i].textContent;
                //使用者已確定搜尋，隱藏推薦項目
                instantResultContainer.style.display = "none";
                clickValue = allLink[i].innerText;
                //將點擊後的畫面串上
                callApi(clickValue);
            });
        }
    }
}
//分類標題(三個頁面都相同)
function flagClick(){
    let searchChordPage = document.getElementById("search-chord-page");
    let guitarModel = document.getElementById("guitar-model");
    let chordDictionary = document.getElementById("chord-dictionary");
    searchChordPage.addEventListener("click",()=>{
        location.href="/search";
    });
    guitarModel.addEventListener("click",()=>{
        location.href="/model";
    });
    chordDictionary.addEventListener("click",()=>{
        location.href="/dictionary";
    });
}
//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    flagClick();
    showResultContainer();
    searchBar();
    searchBarRecoomand();
}