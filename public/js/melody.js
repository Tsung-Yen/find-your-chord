//拖曳和弦
let dragHistory = {
    "C":null,
    "Dm":null,
    "Em":null,
    "F":null,
    "G":null,
    "Am":null
}
function dragChord(){
    let draggable = document.querySelectorAll(".chord");
    let container = document.querySelector(".chord_container");

    draggable.forEach(draggable =>{
        draggable.addEventListener("dragstart",()=>{
            draggable.classList.add("dragging");
        });

        draggable.addEventListener("dragend",()=>{
            draggable.classList.remove("dragging");
            if(draggable.innerText == "C" && dragHistory["C"] == null){
                dragHistory["C"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("C").style.display = "initial";
                playAudio();
            }else if(draggable.innerText == "Dm" && dragHistory["Dm"] == null){
                dragHistory["Dm"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("Dm").style.display = "initial";
                playAudio();
            }else if(draggable.innerText == "Em" && dragHistory["Em"] == null){
                dragHistory["Em"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("Em").style.display = "initial";
                playAudio();
            }else if(draggable.innerText == "F" && dragHistory["F"] == null){
                dragHistory["F"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("F").style.display = "initial";
                playAudio();
            }else if(draggable.innerText == "G" && dragHistory["G"] == null){
                dragHistory["G"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("G").style.display = "initial";
                playAudio();
            }else if(draggable.innerText == "Am" && dragHistory["Am"] == null){
                dragHistory["Am"] = true;
                let audio = document.createElement("audio");
                audio.className = "audio";
                audio.innerText = draggable.innerText;
                draggable.appendChild(audio);
                //移除和弦按鈕顯現
                document.getElementById("Am").style.display = "initial";
                playAudio();
            }
            removeChord();
        });
    });
    container.addEventListener("dragover",(e)=>{
        e.preventDefault();
        let glow = document.querySelector(".glowing").style.display="none";
        let afterElement = getDragAfterElement(container , e.clientX);
        let chord = document.querySelector(".dragging");
        if(afterElement == null){
            container.append(chord);
        }else{
            container.insertBefore(chord , afterElement);
        }
    });

    function getDragAfterElement(container,x){
        let draggableElements = [...container.querySelectorAll(".chord:not(.dragging)")]
        
        return draggableElements.reduce((closest,child)=>{
            let box = child.getBoundingClientRect();
            let offset = x - box.left - box.width / 2;
            if(offset < 0 && offset > closest.offset){
                return {offset: offset, element: child}
            }else{
                return closest
            }
        }, {offset: Number.NEGATIVE_INFINITY}).element;
    }
}
function removeChord(){
    //移除選定和弦
    let cancles = document.querySelectorAll(".cancle");
    cancles.forEach(cancle=>{
        cancle.addEventListener("click",()=>{
            let cancleTarget = cancle.id;
            let elements = document.querySelectorAll(".chord");
            elements.forEach(element=>{
                if(element.innerText == cancleTarget){
                    cancle.style.display = "none";         //將移除按鈕隱藏
                    //移除audio標籤，將拖曳紀錄改回null
                    let audios = document.querySelectorAll("audio");
                    audios.forEach(audio=>{
                        if(audio.innerText == cancleTarget){
                            audio.remove();
                            dragHistory[cancleTarget] = null;
                        }
                    });
                    let chord_container = document.getElementById("choose-chord");
                    chord_container.appendChild(element);
                    
                }
            });
        });
    });
}
//播放
let tempoType = "Finger1-";
function playAudio(){
    //選擇節奏
    let tempos = document.querySelectorAll(".tempo");
    tempos[0].style.color = "red"   //預設節奏
    tempos.forEach(tempo=>{
        tempo.addEventListener("click",()=>{
            if(tempo.innerText == "指法1"){
                tempoType = "Finger1-";
            }else if(tempo.innerText == "指法2"){
                tempoType = "Finger2-";
            }else if(tempo.innerText == "指法3"){
                tempoType = "sweep1-";
            }else if(tempo.innerText == "指法4"){
                tempoType = "Country-";
            }
            tempo.style.color = "red";
            for(let i=0;i<tempos.length;i++){
                if(tempos[i].innerText != tempo.innerText){
                    tempos[i].style.color = "rgb(94, 91, 91)";
                }
            }
        });
        
    });
    //點擊播放
    let playButton = document.querySelector(".play");
    playButton.addEventListener("click",()=>{
        let audios = document.querySelectorAll(".audio");
        if(audios[0] != undefined){
            let target_chord = document.querySelectorAll(".audio");
            let audio_url = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/";
            target_chord.forEach(audio=>{
                audio.src = audio_url+tempoType+audio.innerText+".m4a";
            });
            
            setTimeout(()=>{
                for(let i=0;i<target_chord.length;i++){
                    target_chord[0].play();
                    
                    target_chord[i].onended =  (()=>{
                        let nextAudio = target_chord[i+1];
                        if(nextAudio != null){
                            nextAudio.play();
                        }else{
                            return;
                        }
                    });
                }
                
            },500);
        }else{
            alert("沒有輸入和弦");
        }
        
    });
    //暫停播放
    let pause =  document.querySelector(".pause");
    pause.addEventListener("click",()=>{
        let existAudio = document.querySelectorAll(".audio");
        existAudio.forEach(audio=>{
            audio.pause();
            audio.currentTime = 0;
        });
    });
}
//滑鼠移過效果
function mouseOver(){
    let chord = document.querySelectorAll(".chord");
    let tempo = document.querySelectorAll(".tempo");
    mouse(chord);
    mouse(tempo);
    function mouse(param){
        param.forEach(p=>{
            p.addEventListener("mouseover",()=>{
                p.style.borderStyle = "solid";
            });
            p.addEventListener("mouseout",()=>{
                p.style.borderStyle = "none";
            });
        });
    }
}
//點擊重整
function reload(){
    let refresh = document.getElementById("refresh");
    refresh.addEventListener("click",()=>{
        location.reload();
    });
}
//使用者點擊保存旋律
function saveAudio(){
    let saveButton = document.querySelector(".save");
    saveButton.addEventListener("click",()=>{
        let data = {        //將使用者選擇的和弦排列送到server
            "audios":[],
            "type":tempoType.replace("-","")
        }
        let audios = document.querySelectorAll(".audio");
        audios.forEach(audio=>{
            data["audios"].push(audio.innerText);
        });
        if(audios[0] != undefined){ //檢查資料是否為正確填寫
            fetch("/api/saveaudio",{method:"POST",headers:{
                "Content-Type":"application/json"
            },body:JSON.stringify(data)}).then((res)=>res.json())
            .then((result)=>{
                if(result["ok"] == true){
                    let saveResult = document.querySelector(".save-result");
                    saveResult.style.display = "block";
                    setTimeout(()=>{
                        //寫入資料庫後重整
                        location.reload();
                    },2200);
                }else {
                    location.href = "/sign";
                }
            });
        }else{
            alert("請將和弦拖曳至表格")
        }
        


    });
}

//(檢查使用者狀態)
function userStatus(){
    let api = "/api/status";
    fetch(api).then((res)=>res.json())
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
            userSignOut();
            //如果使用者曾經編輯且儲存和弦將其拉出
            let historyChord = document.querySelector(".history-chord");
            if(result["data"]["audio"]!= " " && result["data"]["type"]!=" "){
                let string = "";
                result["data"]["audio"].forEach(audio=>{
                    string = string+audio+" ";
                });
                let historyTitle = document.querySelector(".history-title");
                historyTitle.style.display = "block";
                historyChord.innerText = "和弦紀錄 ： "+string;
                let buttons = document.getElementById("history-play");
                buttons.style.display = "block";
                //播放按鈕
                let playAudio = document.querySelector(".play-history");
                playAudio.addEventListener("click",()=>{
                    let audio_container = document.querySelector(".history-audio-container");
                    result["data"]["audio"].forEach(audio=>{
                        let audioTag = document.createElement("audio");
                        let url = "https://yanyanbucket.s3.ap-northeast-2.amazonaws.com/";
                        audioTag.src = url+result["data"]["type"]+"-"+audio+".m4a";
                        audioTag.className = "history-audio";
                        audio_container.appendChild(audioTag);
                    });
                    //播放
                    let audioTags = document.querySelectorAll(".history-audio");
                    setTimeout(()=>{
                        for(let i=0;i<audioTags.length;i++){
                            audioTags[0].play();
                            audioTags[i].onended = ()=>{
                                let nextElement = audioTags[i+1];
                                if(nextElement != null){
                                    nextElement.play();
                                }else return;
                            }
                        }
                    },1000);
                });
                //暫停按鈕
                let pauseButton = document.querySelector(".pause-history");
                pauseButton.addEventListener("click",()=>{
                    let audioTags = document.querySelectorAll(".history-audio");
                    audioTags.forEach(audio=>{
                        audio.pause();
                        audio.currentTime = 0;
                    });
                });
                //刪除音檔按鈕
                let deleteButton = document.querySelector(".delete-history");
                deleteButton.addEventListener("click",()=>{
                    let api_url = "/api/deleteaudio";
                    let id = result["data"]["id"];
                    let data = {
                        "id":id
                    }
                    fetch(api_url,{method:"DELETE",headers:{
                        "Content-Type":"application/json"
                    },body:JSON.stringify(data)})
                    .then((res)=>res.json()).then((result)=>{
                        if(result["ok"] == true){
                            setTimeout(()=>{
                                location.reload();
                            },500)
                        }else return;
                    });
                });
            }else{
                let historyTitle = document.querySelector(".history-title");
                historyTitle.style.display = "block";
                historyChord.innerText = "沒有紀錄";
            }
        }else{
            return;
        }
    });
}
//(登出)
function userSignOut(){
    let signout = document.getElementById("signout");
    signout.addEventListener("click",()=>{
        let api = "/api/signout";
        fetch(api,{method:"DELETE"})
        .then((res)=>res.json()).then((result)=>{
            setTimeout(()=>{
                location.reload();
            },600);
        });
    });
}

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
//初始化載入
let body = document.getElementById("body");
body.addEventListener("load",init());
function init(){
    flagClick();            //載入分類標點擊事件
    reload();
    mouseOver();
    dragChord();            //拖曳和弦
    userStatus();
    saveAudio();
}