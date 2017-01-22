// WebApp long poll,

var EventEmitter = require('events').EventEmitter;
var messageBus = new EventEmitter();
messageBus.setMaxListeners(100);

global.PIXEL = function (response) {
    messageBus.emit("pixel", response);
};

var setupLongPoll = {
    prev: "",
    init: function() {
        global.SERVER.get('/transcript', function(req, response) {
            var addMessageListener = function(res) {
                messageBus.once('transcript', function(data) {
                    res.json(data);
                });
            }
            addMessageListener(response);
        });
        
        global.SERVER.get('/pixel', function(req, response) {
            var addMessageListener = function(res) {
                messageBus.once('pixel', function(data) {
                    res.json(data);
                });
            }
            addMessageListener(response);
        });

        global.SERVER.get('/livetext', function(req, response) {
            var addMessageListener = function(res) {
                messageBus.once('livetext', function(data) {
                    res.json(data);
                });
            }
            addMessageListener(response);
        });
    },
    reset: function() {
        global.speech__.on('data', function(data) {
            if (data.endpointerType === 'END_OF_SPEECH') {
                messageBus.emit("transcript", setupLongPoll.prev.results);
            } else if (data.results.length > 1) {
                messageBus.emit('livetext', data.results);
                setupLongPoll.prev = data;
            }
        });
    }
};

module.exports = setupLongPoll;
