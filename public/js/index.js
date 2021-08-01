//拖曳和弦
function dragChord(){
    let draggable = document.querySelectorAll(".chord");
    let container = document.querySelectorAll(".chord_container");
    
    draggable.forEach(draggable =>{
        draggable.addEventListener("dragstart",()=>{
            draggable.classList.add("dragging");
            draggable.removeEventListener
        });

        draggable.addEventListener("dragend",()=>{
            draggable.classList.remove("dragging");
        });
    });
    container.forEach(container=>{
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
//滑鼠移過效果
function mouseOver(){
    let key = document.querySelectorAll(".key");
    let chord = document.querySelectorAll(".chord");
    let tempo = document.querySelectorAll(".tempo");
    mouse(key);
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
    mouseOver();
    dragChord();            //拖曳和弦
}