//點擊琴格載入音檔
function clickFret(){
    //和弦載入紀錄
    let s1 = null;
    let s2 = null;
    let s3 = null;
    let s4 = null;
    let s5 = null;
    let s6 = null;

    //第一弦
    let string_1 = document.getElementsByClassName("string1");
    let string1_audio = document.getElementById("string1_audio");
    for(let i=0;i<string_1.length;i++){
        string_1[i].addEventListener("click",()=>{
            s1 = true;
            if(i == 0){
                string1_audio.src = "#";
            }else{
                i = i-1;
                changeAudio("+1-"+i.toString()+".m4a",string1_audio);            //點擊琴格載入音檔
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
            }else{
                i = i-1;
                changeAudio("+2-"+i.toString()+".m4a",string2_audio);            //點擊琴格載入音檔
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
            }else{
                i = i-1;
                changeAudio("+3-"+i.toString()+".m4a",string3_audio);            //點擊琴格載入音檔
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
            }else{
                i = i-1;
                changeAudio("+4-"+i.toString()+".m4a",string4_audio);            //點擊琴格載入音檔
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
            }else{
                i = i-1;
                changeAudio("+5-"+i.toString()+".m4a",string5_audio);            //點擊琴格載入音檔
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
            }else{
                i = i-1;
                changeAudio("+6-"+i.toString()+".m4a",string6_audio);            //點擊琴格載入音檔
            }
        });
    }
    
    if(s1==null)changeAudio("+1-0.m4a",string1_audio);
    if(s2==null)changeAudio("+2-0.m4a",string2_audio);
    if(s3==null)changeAudio("+3-0.m4a",string3_audio);
    if(s4==null)changeAudio("+4-0.m4a",string4_audio);
    if(s5==null)changeAudio("+5-0.m4a",string5_audio);
    if(s6==null)changeAudio("+6-0.m4a",string6_audio);

    function changeAudio(id,stringNum){
        let stringSoundUrl = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/String";
        stringNum.src = stringSoundUrl+id;
    }

    let playAudio =  () => {
        let playButton = document.querySelector(".play-audio");
        playButton.addEventListener("click",()=>{
            string1_audio.play();
            string2_audio.play();
            string3_audio.play();
            string4_audio.play();
            string5_audio.play();
            string6_audio.play();
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