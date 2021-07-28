//點擊琴格載入音檔
function clickFret(){
    //和弦載入紀錄
    let s1 = null;
    let s2 = null;
    let s3 = null;
    let s4 = null;
    let s5 = null;
    let s6 = null;
    let buttonClick = false;        //點擊播放紀錄限制使用者連續呼叫
    let stringValue = {             //記錄使用者點擊之音階紀錄後送到後端比對
        "string1":null,
        "string2":null,
        "string3":null,
        "string4":null,
        "string5":null,
        "string6":null
    }          
    
    //第一弦
    let string_1 = document.getElementsByClassName("string1");
    let string1_audio = document.getElementById("string1_audio");
    for(let i=0;i<string_1.length;i++){
        string_1[i].addEventListener("click",()=>{
            s1 = true;
            if(i == 0){
                string1_audio.src = "#";
                stringValue["string1"] = "mute";
            }else{
                changeAudio("1-"+(i-1).toString()+".m4a",string1_audio);            //點擊琴格載入音檔
                stringValue["string1"] = string_1[i].value;
            }
        });
    }
    //第二弦
    let string_2 = document.getElementsByClassName("string2");
    let string2_audio = document.getElementById("string2_audio");
    for(let i=0;i<string_2.length;i++){
        string_2[i].addEventListener("click",()=>{
            s2 = true;
            if(i == 0){
                string2_audio.src = "#";
                stringValue["string2"] = "mute";
            }else{
                changeAudio("2-"+(i-1).toString()+".m4a",string2_audio);            //點擊琴格載入音檔
                stringValue["string2"] = string_2[i].value;
            }
        });
    }
    //第三弦
    let string_3 = document.getElementsByClassName("string3");
    let string3_audio = document.getElementById("string3_audio");
    for(let i=0;i<string_3.length;i++){
        string_3[i].addEventListener("click",()=>{
            s3 = true;
            if(i == 0){
                string3_audio.src = "#";
                stringValue["string3"] = "mute";
            }else{
                changeAudio("3-"+(i-1).toString()+".m4a",string3_audio);            //點擊琴格載入音檔
                stringValue["string3"] = string_3[i].value;
            }
        });
    }
    //第四弦
    let string_4 = document.getElementsByClassName("string4");
    let string4_audio = document.getElementById("string4_audio");
    for(let i=0;i<string_4.length;i++){
        string_4[i].addEventListener("click",()=>{
            s4 = true;
            if(i == 0){
                string4_audio.src = "#";
                stringValue["string4"] = "mute";
            }else{
                changeAudio("4-"+(i-1).toString()+".m4a",string4_audio);            //點擊琴格載入音檔
                stringValue["string4"] = string_4[i].value;
            }
        });
    }
    //第五弦
    let string_5 = document.getElementsByClassName("string5");
    let string5_audio = document.getElementById("string5_audio");
    for(let i=0;i<string_5.length;i++){
        string_5[i].addEventListener("click",()=>{
            s5 = true;
            if(i == 0){
                string5_audio.src = "#";
                stringValue["string5"] = "mute";
            }else{
                changeAudio("5-"+(i-1).toString()+".m4a",string5_audio);            //點擊琴格載入音檔
                stringValue["string5"] = string_5[i].value;
            }
        });
    }
    //第六弦
    let string_6 = document.getElementsByClassName("string6");
    let string6_audio = document.getElementById("string6_audio");
    for(let i=0;i<string_6.length;i++){
        string_6[i].addEventListener("click",()=>{
            s6 = true;
            if(i == 0){
                string6_audio.src = "#";
                stringValue["string6"] = "mute";
            }else{
                changeAudio("6-"+(i-1).toString()+".m4a",string6_audio);            //點擊琴格載入音檔
                stringValue["string6"] = string_6[i].value;
            }
        });
    }
    //預設一開始呼叫空弦
    if(s1==null)changeAudio("1-0.m4a",string1_audio);
    if(s2==null)changeAudio("2-0.m4a",string2_audio);
    if(s3==null)changeAudio("3-0.m4a",string3_audio);
    if(s4==null)changeAudio("4-0.m4a",string4_audio);
    if(s5==null)changeAudio("5-0.m4a",string5_audio);
    if(s6==null)changeAudio("6-0.m4a",string6_audio);
    //替換網址
    function changeAudio(id,stringNum){
        let stringSoundUrl = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/S";
        stringNum.src = stringSoundUrl+id;
    }
    //點擊按鍵撥放所有音階
    let playAudio =  () => {
        let playButton = document.querySelector(".play-audio");
        playButton.addEventListener("click",()=>{
            if(buttonClick == false){
                buttonClick = true;
                string1_audio.play();
                string2_audio.play();
                string3_audio.play();
                string4_audio.play();
                string5_audio.play();
                string6_audio.play();
                //使用者查詢的單音組合後送往伺服器比對是否有對應和弦
                let data = {}
                //string1
                if(s1 != null) data["string1"]=stringValue["string1"];
                else data["string1"]=string_1[1].value;
                //string2
                if(s2 != null) data["string2"]=stringValue["string2"];
                else data["string2"]=string_2[1].value;
                //string3
                if(s3 != null) data["string3"]=stringValue["string3"];
                else data["string3"]=string_3[1].value;
                //string4
                if(s4 != null) data["string4"]=stringValue["string4"];
                else data["string4"]=string_4[1].value;
                //string5
                if(s5 != null) data["string5"]=stringValue["string5"];
                else data["string5"]=string_5[1].value;
                //string6
                if(s6 != null) data["string6"]=stringValue["string6"];
                else data["string6"]=string_6[1].value;
                
                let model_url = "/api/model";
                fetch(model_url,{method:"POST",headers:
                {
                    "Content-Type":"application/json"
                },body:JSON.stringify(data)}).then((res)=>res.json()).then((result)=>{
                    console.log(result);
                });
                
                //點擊效果及限制使用者連續呼叫
                playButton.style.opacity="0.2";
                playButton.style.background="red";
                playButton.innerHTML = "播放中";
                window.setTimeout(()=>{
                    buttonClick = false
                    playButton.style.opacity="1";
                    playButton.innerHTML = "播放";
                    playButton.style.background="teal";
                },2200);
            }
        });
    }
    playAudio();
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
    clickFret();               //點擊琴格載入音檔
}