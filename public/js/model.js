//點擊琴格載入音檔
function clickFret(){
    // //和弦載入紀錄
    // let s1 = null;
    // let s2 = null;
    // let s3 = null;
    // let s4 = null;
    // let s5 = null;
    // let s6 = null;
    // let buttonClick = false;        //點擊播放紀錄限制使用者連續呼叫
    // let stringValue = {             //記錄使用者點擊之音階紀錄後送到後端比對
    //     "string1":null,
    //     "string2":null,
    //     "string3":null,
    //     "string4":null,
    //     "string5":null,
    //     "string6":null
    // }          
    
    // //第一弦
    // let string_1 = document.getElementsByClassName("string1");
    // let string1_audio = document.getElementById("string1_audio");
    // for(let i=0;i<string_1.length;i++){
    //     string_1[i].addEventListener("click",()=>{
    //         s1 = true;
    //         if(i == 0){
    //             string1_audio.src = "#";
    //             stringValue["string1"] = "mute";
    //         }else{
    //             changeAudio("1-"+(i-1).toString()+".m4a",string1_audio);            //點擊琴格載入音檔
    //             stringValue["string1"] = string_1[i].value;
    //         }
    //     });
    // }
    // //第二弦
    // let string_2 = document.getElementsByClassName("string2");
    // let string2_audio = document.getElementById("string2_audio");
    // for(let i=0;i<string_2.length;i++){
    //     string_2[i].addEventListener("click",()=>{
    //         s2 = true;
    //         if(i == 0){
    //             string2_audio.src = "#";
    //             stringValue["string2"] = "mute";
    //         }else{
    //             changeAudio("2-"+(i-1).toString()+".m4a",string2_audio);            //點擊琴格載入音檔
    //             stringValue["string2"] = string_2[i].value;
    //         }
    //     });
    // }
    // //第三弦
    // let string_3 = document.getElementsByClassName("string3");
    // let string3_audio = document.getElementById("string3_audio");
    // for(let i=0;i<string_3.length;i++){
    //     string_3[i].addEventListener("click",()=>{
    //         s3 = true;
    //         if(i == 0){
    //             string3_audio.src = "#";
    //             stringValue["string3"] = "mute";
    //         }else{
    //             changeAudio("3-"+(i-1).toString()+".m4a",string3_audio);            //點擊琴格載入音檔
    //             stringValue["string3"] = string_3[i].value;
    //         }
    //     });
    // }
    // //第四弦
    // let string_4 = document.getElementsByClassName("string4");
    // let string4_audio = document.getElementById("string4_audio");
    // for(let i=0;i<string_4.length;i++){
    //     string_4[i].addEventListener("click",()=>{
    //         s4 = true;
    //         if(i == 0){
    //             string4_audio.src = "#";
    //             stringValue["string4"] = "mute";
    //         }else{
    //             changeAudio("4-"+(i-1).toString()+".m4a",string4_audio);            //點擊琴格載入音檔
    //             stringValue["string4"] = string_4[i].value;
    //         }
    //     });
    // }
    // //第五弦
    // let string_5 = document.getElementsByClassName("string5");
    // let string5_audio = document.getElementById("string5_audio");
    // for(let i=0;i<string_5.length;i++){
    //     string_5[i].addEventListener("click",()=>{
    //         s5 = true;
    //         if(i == 0){
    //             string5_audio.src = "#";
    //             stringValue["string5"] = "mute";
    //         }else{
    //             changeAudio("5-"+(i-1).toString()+".m4a",string5_audio);            //點擊琴格載入音檔
    //             stringValue["string5"] = string_5[i].value;
    //         }
    //     });
    // }
    // //第六弦
    // let string_6 = document.getElementsByClassName("string6");
    // let string6_audio = document.getElementById("string6_audio");
    // for(let i=0;i<string_6.length;i++){
    //     string_6[i].addEventListener("click",()=>{
    //         s6 = true;
    //         if(i == 0){
    //             string6_audio.src = "#";
    //             stringValue["string6"] = "mute";
    //         }else{
    //             changeAudio("6-"+(i-1).toString()+".m4a",string6_audio);            //點擊琴格載入音檔
    //             stringValue["string6"] = string_6[i].value;
    //         }
    //     });
    // }
    // //預設一開始呼叫空弦
    // if(s1==null)changeAudio("1-0.m4a",string1_audio);
    // if(s2==null)changeAudio("2-0.m4a",string2_audio);
    // if(s3==null)changeAudio("3-0.m4a",string3_audio);
    // if(s4==null)changeAudio("4-0.m4a",string4_audio);
    // if(s5==null)changeAudio("5-0.m4a",string5_audio);
    // if(s6==null)changeAudio("6-0.m4a",string6_audio);
    //替換網址
    // function changeAudio(id,stringNum){
    //     let stringSoundUrl = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/S";
    //     stringNum.src = stringSoundUrl+id;
    // }
    //所有和弦
    
    
    //點擊按鍵撥放所有音階
    // let playAudio =  () => {
    //     let chordResult = document.querySelector(".chord-result");
    //     
    //     playButton.addEventListener("click",()=>{
    //         if(buttonClick == false){
    //             buttonClick = true;
    //             string1_audio.play();
    //             string2_audio.play();
    //             string3_audio.play();
    //             string4_audio.play();
    //             string5_audio.play();
    //             string6_audio.play();
    //             //使用者查詢的單音組合後送往伺服器比對是否有對應和弦
    //             let data = {}
    //             //string1
    //             if(s1 != null) data["string1"]=stringValue["string1"];
    //             else data["string1"]=string_1[1].value;
    //             //string2
    //             if(s2 != null) data["string2"]=stringValue["string2"];
    //             else data["string2"]=string_2[1].value;
    //             //string3
    //             if(s3 != null) data["string3"]=stringValue["string3"];
    //             else data["string3"]=string_3[1].value;
    //             //string4
    //             if(s4 != null) data["string4"]=stringValue["string4"];
    //             else data["string4"]=string_4[1].value;
    //             //string5
    //             if(s5 != null) data["string5"]=stringValue["string5"];
    //             else data["string5"]=string_5[1].value;
    //             //string6
    //             if(s6 != null) data["string6"]=stringValue["string6"];
    //             else data["string6"]=string_6[1].value;
                
    //             let model_url = "/api/model";
    //             fetch(model_url,{method:"POST",headers:
    //             {
    //                 "Content-Type":"application/json"
    //             },body:JSON.stringify(data)}).then((res)=>res.json()).then((result)=>{
    //                 if(result["ok"] == true){
    //                     chordResult.innerHTML = "搜尋結果 ： "+result["chord"]+" 和弦";
    //                 }else{
    //                     chordResult.innerHTML = result["message"];
    //                 }
    //             });
                
    //             //點擊效果及限制使用者連續呼叫
    //             
    //             window.setTimeout(()=>{
    //                 buttonClick = false
    //                 
    //             },2200);
    //         }
    //     });
    // }
    // playAudio();


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
                let string1Num = null;
                let string2Num = null;
                let string3Num = null;
                let string4Num = null;
                let string5Num = null;
                let string6Num = null;
                let moduleChord = module.innerText;
                fetch("/api/model?keyword="+moduleChord).then((res)=>res.json())
                .then((result)=>{
                    if(result["ok"] == true){
                        for(let i=0;i<result["data"].length;i++){
                            let newModule = document.createElement("div");
                            newModule.textContent = result["data"][i]["chord"];
                            newModule.className = "module-chords";
                            moduleContainer.append(newModule);
                            //將模板和弦套上
                            if(result["data"][i]["chord"] == "C"){   
                            }
                        }
                        let allmodule = document.querySelectorAll(".module-chords");
                        allmodule.forEach(chord=>{
                            chord.addEventListener("click",()=>{
                                let keyword = chord.innerText.replace("#","sharp");
                                fetch("/api/model?chord="+keyword)
                                .then((res)=>res.json()).then((result)=>{
                                    if(result["ok"] == true){
                                        if(result["chord"].includes("C") == true){
                                            string_6[0].checked = "checked";
                                            // string_3[1].checked = "checked";
                                            for(let i=0;i<string_5.length;i++){
                                                string_5.forEach(s=>{
                                                    if(s.value == result["contain"][0]){
                                                        s.checked = "checked";
                                                    }
                                                });
                                                string_4.forEach(s=>{
                                                    if(s.value == result["contain"][1]){
                                                        s.checked = "checked";
                                                    }
                                                });
                                                string_2.forEach(s=>{
                                                    if(s.value == result["contain"][0]){
                                                        s.checked = "checked";
                                                    }
                                                });
                                                string_1.forEach(s=>{
                                                    if(s.value == result["contain"][1]){
                                                        s.checked = "checked";
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            })
                        })
                        

                    }
                })
                // if(module.innerText == "C"){
                //     string1Num = 1;
                //     string2Num = 2;
                //     string3Num = 1;
                //     string4Num = 3;
                //     string5Num = 4;
                //     string6Num = 0;
                // }else if(module.innerText == "Dm"){
                //     string1Num = 2;
                //     string2Num = 4;
                //     string3Num = 3;
                //     string4Num = 1;
                //     string5Num = 0;
                //     string6Num = 0;
                // }else if(module.innerText == "Em"){
                //     string1Num = 1;
                //     string2Num = 1;
                //     string3Num = 1;
                //     string4Num = 3;
                //     string5Num = 3;
                //     string6Num = 1;
                // }else if(module.innerText == "F"){
                //     string1Num = 2;
                //     string2Num = 2;
                //     string3Num = 3;
                //     string4Num = 4;
                //     string5Num = 4;
                //     string6Num = 2;
                // }else if(module.innerText == "G"){
                //     string1Num = 4;
                //     string2Num = 1;
                //     string3Num = 1;
                //     string4Num = 1;
                //     string5Num = 3;
                //     string6Num = 4;
                // }else if(module.innerText == "Am"){
                //     string1Num = 1;
                //     string2Num = 2;
                //     string3Num = 3;
                //     string4Num = 3;
                //     string5Num = 1;
                //     string6Num = 0;
                // }else if(module.innerText == "Bdim"){
                //     string1Num = 0;
                //     string2Num = 4;
                //     string3Num = 5;
                //     string4Num = 4;
                //     string5Num = 3;
                //     string6Num = 0;
                // }else if(module.innerText == "Cmaj7"){
                //     string1Num = 4;
                //     string2Num = 6;
                //     string3Num = 5;
                //     string4Num = 6;
                //     string5Num = 4;
                //     string6Num = 0;
                // }else if(module.innerText == "Dm7"){
                //     string1Num = 6;
                //     string2Num = 7;
                //     string3Num = 6;
                //     string4Num = 8;
                //     string5Num = 6;
                //     string6Num = 0;
                // }else if(module.innerText == "Em7"){
                //     string1Num = 1;
                //     string2Num = 4;
                //     string3Num = 1;
                //     string4Num = 3;
                //     string5Num = 3;
                //     string6Num = 1;
                // }else if(module.innerText == "Fmaj7"){
                //     string1Num = 1;
                //     string2Num = 2;
                //     string3Num = 3;
                //     string4Num = 4;
                //     string5Num = 0;
                //     string6Num = 2;
                // }else if(module.innerText == "Gmaj7"){
                //     string1Num = 3;
                //     string2Num = 4;
                //     string3Num = 5;
                //     string4Num = 0;
                //     string5Num = 0;
                //     string6Num = 4;
                // }else if(module.innerText == "Am7"){
                //     string1Num = 1;
                //     string2Num = 2;
                //     string3Num = 1;
                //     string4Num = 3;
                //     string5Num = 1;
                //     string6Num = 0;
                // }else if(module.innerText == "Bdim7"){
                //     string1Num = 2;
                //     string2Num = 4;
                //     string3Num = 2;
                //     string4Num = 4;
                //     string5Num = 3;
                //     string6Num = 0;
                // }
                // string_1[string1Num].checked = "checked";
                // string_2[string2Num].checked = "checked";
                // string_3[string3Num].checked = "checked";
                // string_4[string4Num].checked = "checked";
                // string_5[string5Num].checked = "checked";
                // string_6[string6Num].checked = "checked";
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
                    if(data["chord-index"][0] != "mute"){
                        string1_audio.src = url+data["chord-index"][0]+".m4a";
                        string1_audio.play();
                    }
                    if(data["chord-index"][1] != "mute"){
                        string2_audio.src = url+data["chord-index"][1]+".m4a";
                        string2_audio.play();
                    }
                    if(data["chord-index"][2] != "mute"){
                        string3_audio.src = url+data["chord-index"][2]+".m4a";
                        string3_audio.play();
                    }
                    if(data["chord-index"][3] != "mute"){
                        string4_audio.src = url+data["chord-index"][3]+".m4a";
                        string4_audio.play();
                    }
                    if(data["chord-index"][4] != "mute"){
                        string5_audio.src = url+data["chord-index"][4]+".m4a";
                        string5_audio.play();
                    }
                    if(data["chord-index"][5] != "mute"){
                        string6_audio.src = url+data["chord-index"][5]+".m4a";
                        string6_audio.play();
                    }
                    window.setTimeout(()=>{
                        preventDoublePress = false;
                        playButton.style.opacity="1";
                        playButton.innerHTML = "播放";
                        playButton.style.background="teal";
                    },1500);
                },200); 
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