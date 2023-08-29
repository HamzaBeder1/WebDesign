const http = require('http');
const fs = require('fs');

const requestListener = function(req,res){
    res.setHeader("Content-Type", "text/plain");
    res.writeHead(200);
    if(req.url == '/dict'){
        fs.readFile('../dictionary/dict.txt', 'ascii', (err,data)=>{
            data = data.replace(/\r\n/gi, ' ');
            res.end(data);
        });
    }
}

const server = http.createServer(requestListener);
server.listen(8000, 'localhost',()=>{
    console.log("Server is running")
});
