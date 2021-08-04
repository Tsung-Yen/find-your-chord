//點擊琴格載入音檔
function clickFret(){
    let string_1 = document.querySelectorAll(".string1");//第一弦
    let string1_audio = document.getElementById("string1_audio");
    let string_2 = document.querySelectorAll(".string2");//第二弦
    let string2_audio = document.getElementById("string2_audio");
    let string_3 = document.querySelectorAll(".string3");//第三弦
    let string3_audio = document.getElementById("string3_audio");
    let string_4 = document.querySelectorAll(".string4");//第四弦
    let string4_audio = document.getElementById("string4_audio");
    let string_5 = document.querySelectorAll(".string5");//第五弦
    let string5_audio = document.getElementById("string5_audio");
    let string_6 = document.querySelectorAll(".string6");//第六弦
    let string6_audio = document.getElementById("string6_audio");
    //將每隔音階賦予id
    for(let i=0;i<string_1.length;i++){
        if(i == 0){
            string_1[i].id = "mute";
            string_2[i].id = "mute";
            string_3[i].id = "mute";
            string_4[i].id = "mute";
            string_5[i].id = "mute";
            string_6[i].id = "mute";
        }else{
            string_1[i].id = "1-"+(i-1);
            string_2[i].id = "2-"+(i-1);
            string_3[i].id = "3-"+(i-1);
            string_4[i].id = "4-"+(i-1);
            string_5[i].id = "5-"+(i-1);
            string_6[i].id = "6-"+(i-1);
        }
            
    }
    //模組和弦
    chordModule();
    function chordModule(){
        let chordModule = document.querySelectorAll("chord-module");
        let module = document.querySelectorAll(".module");
        let moduleContainer = document.querySelector(".module-container");
        module.forEach(module=>{
            module.addEventListener("mouseover",()=>{
                module.style.opacity = "0.5";
            });
            module.addEventListener("mouseout",()=>{
                module.style.opacity = "1";
            });
            module.addEventListener("click",()=>{
                moduleContainer.innerHTML = "";
                document.getElementById("choose-module").style.display="block";
                let moduleChord = module.innerText;
                fetch("/api/model?keyword="+moduleChord).then((res)=>res.json())
                .then((result)=>{
                    if(result["ok"] == true){
                        for(let i=0;i<result["data"].length;i++){
                            let newModule = document.createElement("div");
                            newModule.textContent = result["data"][i]["chord"];
                            newModule.className = "module-chords";
                            moduleContainer.append(newModule);
                        }
                        //將模板和弦套上
                        let allmodule = document.querySelectorAll(".module-chords");
                        for(let i=0;i<allmodule.length;i++){
                            allmodule[i].addEventListener("click",()=>{
                                allmodule[i].style.color = "red";
                                let keyword = allmodule[i].innerText.replace("#","sharp");
                                fetch("/api/model?chord="+keyword)
                                .then((res)=>res.json()).then((result)=>{
                                    if(result["ok"] == true){
                                        let string = result["contain"];
                                        string_6[string[0]].checked = "checked";
                                        string_5[string[1]].checked = "checked";
                                        string_4[string[2]].checked = "checked";
                                        string_3[string[3]].checked = "checked";
                                        string_2[string[4]].checked = "checked";
                                        string_1[string[5]].checked = "checked";
                                    }
                                });
                                for(let j=0;j<allmodule.length;j++){
                                    if(j!=i){
                                        allmodule[j].style.color = "rgb(94, 91, 91)";
                                    }
                                }
                            });
                        }
                    }
                });
            })
        });
    }
    //點擊琴格載入
    function chordClick(){
        let data = {
            "chord-contain":[],
            "chord-index":[]
        };
        string_1.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        string_2.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        string_3.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        string_4.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        string_5.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        string_6.forEach(string=>{
            if(string.checked == true){
                data["chord-index"].push(string.id);
                data["chord-contain"].push(string.value);
            }
        });
        return data;
    }
    //播放音訊(將和弦送到資料庫比對)
    let playAudio = () =>{
        let preventDoublePress = false;
        let playButton = document.querySelector(".play-audio");
        let audioButton = document.querySelector(".play-audio");
        audioButton.addEventListener("click",()=>{
            //點擊效果
            playButton.style.opacity="0.2";
            playButton.style.background="red";
            playButton.innerHTML = "播放中";
            if(preventDoublePress == false){
                let url = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/S"
                let data = chordClick();
                if(data["chord-index"][0] != "mute"){
                    string1_audio.src = url+data["chord-index"][0]+".m4a";
                }
                if(data["chord-index"][1] != "mute"){
                    string2_audio.src = url+data["chord-index"][1]+".m4a";
                }
                if(data["chord-index"][2] != "mute"){
                    string3_audio.src = url+data["chord-index"][2]+".m4a";
                }
                if(data["chord-index"][3] != "mute"){
                    string4_audio.src = url+data["chord-index"][3]+".m4a";
                }
                if(data["chord-index"][4] != "mute"){
                    string5_audio.src = url+data["chord-index"][4]+".m4a";
                }
                if(data["chord-index"][5] != "mute"){
                    string6_audio.src = url+data["chord-index"][5]+".m4a";
                }
                //先將輸入送到資料庫
                let api_data = {
                    "string1":data["chord-contain"][0],
                    "string2":data["chord-contain"][1],
                    "string3":data["chord-contain"][2],
                    "string4":data["chord-contain"][3],
                    "string5":data["chord-contain"][4],
                    "string6":data["chord-contain"][5]
                }
                let api_url = "/api/model";
                fetch(api_url,{method:"POST",headers:{
                    "Content-Type":"application/json"
                },body:JSON.stringify(api_data)}).then((res)=>res.json())
                .then((result)=>{
                    let chordResult = document.querySelector(".chord-result");
                    if(result["ok"] == true){
                        chordResult.innerHTML = "搜尋結果 ： "+result["chord"]+" 和弦";
                    }else{
                        chordResult.innerHTML = result["message"];
                    }
                });
                window.setTimeout(()=>{
                    preventDoublePress = true;
                    let audios = document.querySelectorAll(".audio-play");
                    audios.forEach(audio=>{
                        audio.play();
                        setTimeout(()=>{
                            audio.pause();
                            audio.currentTime = 0;
                        },1200);
                    });
                    window.setTimeout(()=>{
                        preventDoublePress = false;
                        playButton.style.opacity="1";
                        playButton.innerHTML = "播放";
                        playButton.style.background="teal";
                    },1500);
                },500); 
            }
        });
    }
    playAudio();
}

//分類標題(四個個頁面都相同)
function flagClick(){
    let index = document.querySelector(".navbar-header");
    let searchChordPage = document.getElementById("search-chord-page");
    let guitarModel = document.getElementById("guitar-model");
    let chordDictionary = document.getElementById("chord-dictionary");
    let menberSystem = document.getElementById("signing");
    index.addEventListener("click",()=>{
        location.href="/";
    });
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