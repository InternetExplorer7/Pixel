const nexmo = require('./create-nexmo-app');

module.exports = function(cb) {
    if (cb === null || typeof cb === "undefined") {
        cb = function() {};
    }
    nexmo.calls.stream.start(
        global.nexmoID, {
            stream_url: [
                'http://pixel-seanhackett.c9users.io/ding.mp3'
            ],
            loop: 1,
            cb
        });
};
