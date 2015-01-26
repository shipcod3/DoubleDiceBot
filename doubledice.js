//doubledice
//In Progress jakedageek
//latest version 0.2.0 10-11-13

// CoinChat bot

var io = require('socket.io-client');
socket = io.connect("https://coinchat.org", {secure: true});

var username = "nameofthebot";
var outputBuffer = [];
var balance = 0;
var i = 0;

socket.on('connect', function(){
        //Your session key (aka API key)
        //Get this from your browser's cookies.
    socket.emit('login', {session: ""});
    socket.on('loggedin', function(data){
        username = data.username;
        setTimeout(function(){
            socket.emit("getcolors", {});
            socket.emit('joinroom', {join: 'shipcod3'});
            socket.emit("chat", {room: "shipcod3", message: "!bootup", color: "000"}); 
            socket.emit("getbalance", {});
            socket.on('balance', function(data){
                if(typeof data.balance !== 'undefined'){
                    balance = data.balance;
                }
            });
            socket.on('chat', function(data){ //the program loops this bracket
                console.log(data.message);
                i++;
                if(i < 9){
                    data.message = ""
                }else{
                    i = 10;
                    if (data.message === "!help" && data.room === "doubledice") {
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ": doubledice! Tip 0.25 to roll two dice. If both numbers are equal to each other, you get 0.6. If both numbers are 4, 5, or 6, you get 0.4. If both numbers are 1, 2, or 3, you get 0.4. If one number is 1, 2, or 3 but the other is 4, 5, or 6, then you lose. Good Luck!"});
                    }
                    if (data.message === "!balance" && data.room === "doubledice") {
                        socket.emit("getbalance", {});
                        socket.emit("getbalance", {});                        
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ": current balance of bot = " + balance});
                    }
                    if (data.message === "!down" && data.room === "doubledice" && data.user === "shipcod3") {
                        socket.emit("quitroom", {room: "doubledice"});
                        setTimeout(console.log("This is a 1400ms delay."), 1400);
                        socket.disconnect();
                        console.log("doublecoin has shut down. Please ctrl-c.");
                    }
                    if(contains(data.message, ["<span class='label label-success'>has tipped " + username])){
                    }
                }
            });
        }, 1500);
        setInterval(function(){
            //CoinChat has a 550ms anti spam prevention. You can't send a chat message more than once every 550ms.
            if(outputBuffer.length > 0){ 
                if(outputBuffer[0].tipObj){ 
                    socket.emit("tip", outputBuffer.splice(0,1)[0].tipObj); 
                } else{ 
                    var chat = outputBuffer.splice(0,1)[0]; 
                    socket.emit("chat", {room: chat.room, message: chat.message, color: "000"}); 
                } 
            } 
        }, 600);
        function tip(roomName, userName, amount, note){ 
            outputBuffer.push({tipObj: {user: userName, room: roomName, tip: amount, message: note}
            }); 
        }
        function chat(roomName, message){
            outputBuffer.push({room: roomName, color: "000", message: message});
        }
    });
});

function contains(string, terms){
    for(var i=0; i<terms.length; i++){
        if(string.toLowerCase().indexOf(terms[i].toLowerCase()) == -1){
            return false;
        }
    }
    return true;
}
