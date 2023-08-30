let z;
let storeTarget;
window.onload = (event)=>{
    window.onscroll = function() {scroll()};
    //window.addEventListener("keydown", moveCursorAtTheEnd);
    window.addEventListener("contextmenu",showSuggestions);
    window.addEventListener("keydown", checkSpelling, false);
    window.addEventListener("contextmenu", DisplaySuggestions);
    z = new Trie();
    z.buildTrie();
}

function scroll(){
    let header = document.getElementById("header");
    if(window.pageYOffset > header.offsetTop){
        header.classList.add("sticky");
    }
    else
    header.classList.remove("sticky");
} 

function DisplaySuggestions(event){
    if(event.target.id == "enteredText" && window.getComputedStyle(event.target).textDecorationColor == "rgb(255, 0, 0)"){
    let menu = document.getElementById("Suggestions");

    let matches = z.findMatches(event.target.textContent);
    let previousMatches = document.querySelectorAll(".matches");
    previousMatches.forEach(suggestion => suggestion.remove());
    for(let i = 0; i < matches.length; i++){
        const newSuggestion = document.createElement("tr");
        newSuggestion.className = "matches";
        newSuggestion.style.cursor = "pointer";
        newSuggestion.style.padding = 5;
        if(i != matches.length - 1)
            newSuggestion.style.borderBottom = "5px solid black"
        const node = document.createTextNode(`${matches[i]}`);
        newSuggestion.appendChild(node);
        menu.appendChild(newSuggestion);
    }
    let suggestions = document.querySelectorAll(".matches");
    suggestions = Array.prototype.slice.call(suggestions);
    suggestions.forEach(function(s){s.addEventListener("click", correctText)})
    menu.style.position = 'absolute';
    menu.style.top = event.clientY;
    menu.style.left = event.clientX;
    menu.style.display = 'inline';
    storeTarget = event.target;
    }
}

function correctText(event){
    if(event.target.className == "matches"){
        let correction = event.target.textContent;
        const Menu = event.target.parentNode;
        Menu.style.display = "none";
        storeTarget.textContent = correction;
        storeTarget.style.textDecoration = "none";
    }
}

function HideSuggestions(event){
    document.getElementById("Menu").style.display = 'none';
}

function moveCursorAtTheEnd(event){
    var selection=document.getSelection();
    var range=document.createRange();
    var contenteditable=document.getElementById('text');
    if(contenteditable.lastChild.nodeType==3){
      range.setStart(contenteditable.lastChild,contenteditable.lastChild.length);
    }else{
      range.setStart(contenteditable,contenteditable.childNodes.length);
    }
    selection.removeAllRanges();
    selection.addRange(range);
    }


function checkSpelling(event){
    let el = document.getElementById("text"); 
    let updatedText = ``;
    if(event.keyCode == 13){
        let txt = el.textContent;
        txt= txt.replace(/\s+/g,' ');
        el.textContent = "";
        txt = txt.split(" ");
        for(let i = 0; i < txt.length; i++){
            if(z.searchWord(txt[i]) == false){
                el.innerHTML += `<span style="text-decoration:red wavy underline" id = "enteredText">${txt[i] + " "}</span>`;
            }
            else{
                el.innerHTML += `<span>${txt[i] + " "}</span>`;
            }
        }
    }
}

function showSuggestions(event){
    
}


class Node{
    constructor(){
        this.children = {};
        this.word = "";
    }
}

class Trie{
    constructor(){
        this.root = new Node();
        this.maxDistance = 2;
    }

    addWord = function(word){
        let temp = this.root;
        for (let i = 0; i < word.length; i++){
            let elem = word.charAt(i)
            if(!(elem in temp.children)){
                temp.children[elem] = new Node();
            }
            temp = temp.children[elem];
        }
        temp.word = word;
    }

    searchWord = function(word){
        let temp = this.root;
        for(let i = 0; i < word.length; i++){
            if(!(word.charAt(i) in temp.children))
                return false;
            temp = temp.children[word.charAt(i)];
        }
        if (temp.last == "")
            return false;
        return true;
    }

    buildTrie = function(){
        fetch('http://localhost:8000/dict')
        .then(response=>response.text())
        .then(content=>{
            console.log("here");
            let words = content.split(" ");
            for(let i = 0; i < words.length; i++){
                this.addWord(words[i]);
            }
        })
    }
    
    findMatches = function(target){
        target = target.replace(/\s+/g,'');
        let currRow = [];
        for(let i = 0; i <= target.length; i++)
            currRow.push(i);
        let matches = [];
        for(let ch in this.root.children){
            if(ch == 'h')
                console.log("Stop");
            this.findMatches_aux(target, ch, this.root.children[ch], currRow, matches);
        }
        const properWord = /^[a-zA-Z]+$/;
        for(let i = 0; i < matches.length; i++)
        {

            if(matches[i][0] != target[0] || properWord.test(matches[i]) != true){
                matches.splice(i,1);
                i--;
            }
            else{
                console.log("Stop");
            }
        }
        return matches.slice(0, 3);
    }

    findMatches_aux = function(target, ch, node, prevRow, matches){
        if(node.word == "hello"){
            console.log("Stop");
        }
        let currRow = [prevRow[0]+1];
        for(let i = 1; i <= target.length; i++){
            const insert = prevRow[i] +1;
            const del = currRow[i-1] +1;
            let sub = 0;
            if(ch == target[i-1])
                sub = prevRow[i-1];
            else
                sub = prevRow[i-1]+1;
            currRow.push(Math.min(insert,del,sub));
        }
        if(currRow[target.length] <= this.maxDistance && node.word != "")
            matches.push(node.word);
        const min = Math.min.apply(null, currRow)
        if(min <= this.maxDistance){
            for(let path in node.children){
                this.findMatches_aux(target, path, node.children[path], currRow, matches)
            }
        }
    }
}


z = new Trie();
z.buildTrie();
