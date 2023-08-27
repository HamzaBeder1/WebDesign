

class Node{
    constructor(){
        this.children = {};
        this.word = "";
    }
}

class Trie{
    constructor(){
        this.root = new Node();
        this.maxDistance = 1;
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
            const fs = require('fs');
            const content = fs.readFileSync("../dictionary/dict.txt", 'ascii');
            let words = content.split("\r\n");
            for(let i = 0; i < words.length; i++){
                this.addWord(words[i]);
            }
        }
    
    findMatches = function(target){
        let currRow = [];
        for(let i = 0; i <= target.length; i++)
            currRow.push(i);
        let matches = [];
        for(let ch in this.root.children){
            this.findMatches_aux(target, ch, this.root.children[ch], currRow, matches);
        }
        let i = 0;
        for(let word in matches){
            if(word[0] != target[0]){
                matches.splice(i,1);
            }
        }
        return matches;
    }

    findMatches_aux = function(target, ch, node, prevRow, matches){
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


let z = new Trie();
console.log("Done");
z.buildTrie();
console.log(z.findMatches("once"));

