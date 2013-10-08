//doubledice
//In Progress jakedageek
//latest version 0.1.3 10-7-13

// CoinChat bot

var io = require('socket.io-client');
socket = io.connect("https://coinchat.org", {secure: true});

var username = "doubledicebot";
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
            socket.emit('joinroom', {join: 'doubledice'});
            socket.emit("chat", {room: "doubledice", message: "!bootup", color: "000"}); 
            socket.emit("getbalance", {});
            socket.on('balance', function(data){
                if(typeof data.balance !== 'undefined'){
                    balance = data.balance;
                }
            });
            socket.on('chat', function(data){ //the program loops this bracket
                console.log(data.message);
                i++;
                console.log
                if(i < 9){
                    data.message = ""
                }else{
                    console.log(data.message);
                    i
                    if (data.message === "!help" && data.room === "doubledice") {
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ": doubledice! Tip 0.25 to roll two dice. If both numbers are equal to each other, you get 0.75. If both numbers are 4, 5, or 6, you get 0.4. If both numbers are 1, 2, or 3, you get 0.4. If one number is 1, 2, or 3 but the other is 4, 5, or 6, then you lose. Good Luck!"});
                    }
                    if (data.message === "!balance" && data.room === "doubledice") {
                        socket.emit("getbalance", {});
                        socket.emit("getbalance", {});                        
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ": current balance of bot = " + balance});
                    }
                    if (data.message === "!state" && data.room === "doubledice") {
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ": the bot is online."});
                    }
                    if (data.message === "!commands" && data.room === "doubledice") {
                        outputBuffer.push({room: data.room, color: "000", message: data.user + ":, !nom, !state, !commands, !balance"});
                    }
                    if (data.message === "!nom" && data.room === "doubledice") {
                        outputBuffer.push({room: data.room, color: "000", message: "/me noms " + data.user});
                    }
                    if (data.message === "!down" && data.room === "doubledice" && data.user === "jakedageek") {
                        socket.emit("quitroom", {room: "doubledice"});
                        setTimeout(console.log("This is a 1400ms delay."), 1400);
                        socket.disconnect();
                        console.log("doublecoin has shut down. Please ctrl-c.");
                    }
                    if(contains(data.message, ["<span class='label label-success'>has tipped " + username])){
                        var stringamount = data.message.split("<span class='label label-success'>has tipped ")[1].split(" ")[1];
                        var amount = Number(stringamount);
                        var player = data.user;
                        if(amount === 0.25){ //is it 0.25?
                            var roll1 = Math.ceil((Math.random()*100)/(50/3)); //random number from 1 to 6
                            console.log(roll1);
                            var roll2 = Math.ceil((Math.random()*100)/(50/3)); //random number from 1 to 6
                            console.log(roll2)
                            if(roll1 === roll2){
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + " rolled " + roll1 + " and " + roll2 +"."}); //notify
                                tip("doubledice", data.user, 0.75, "doubledice Prize!");
                            }else if(roll1 > 3 && roll2 > 3){
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + " rolled " + roll1 + " and " + roll2 +"."}); //notify
                                tip("doubledice", data.user, 0.40, "doubledice Prize!");
                            }else if(roll1 > 3 && roll2 <= 3){
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + " rolled " + roll1 + " and " + roll2 +"."}); //notify
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + ": sorry, you lost!"}); //notify
                            }else if (roll2 > 3 && roll1 <= 3){
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + " rolled " + roll1 + " and " + roll2 +"."}); //notify
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + ": sorry, you lost!"}); //notify
                            }else if (roll1 <= 3 && roll2 <= 3){
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + " rolled " + roll1 + " and " + roll2 +"."}); //notify
                                tip("doubledice", data.user, 0.40, "doubledice Prize!");
                            }else{
                                outputBuffer.push({room: "doubledice", color: "000", message: data.user + ": Error! Please PM jakedageek."}); //notify
                            }
                        }else{ //not 0.25
                            var refamount = amount * 0.98;
                            tip("doubledice", data.user, refamount, "refund! A tip needs to be a multiple of 0.25.")
                            socket.emit("getbalance", {});
                        }
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
