module.exports = function(server) {

    console.log("WebSocket Ready")

    var WebSocketServer = require('websocket').server;

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: true
    });
    // var speech = require("./speechToText");
    // var speech = require('./googleSpeech');
    
    global.speech__ = require("./googleSpeech");
    
    wsServer.on('connect', function(connection) {
        console.log((new Date()) + ' Connection accepted' + ' - Protocol Version ' + connection.webSocketVersion);
        console.log("Finished with SAY");
        var toggle = 0;
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                // Reflect the message back
                console.log("UTF8 DATA");
                console.log(message.utf8Data);
            }
            else if (message.type === 'binary') {
                // console.log("Binary Message Recieved");
                // setTimeout(function () {
                global.speech__.write(message.binaryData);
                // }, )
                // if (toggle == 4) {
                //     toggle = 0;
                // } else {
                //     global.speech__.write(message.binaryData);
                // }
                // toggle++;
            }
        });
        connection.on('close', function(reasonCode, description) {
            console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
            console.log(reasonCode, description);
        });
    });
};