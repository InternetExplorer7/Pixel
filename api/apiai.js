const config = require('../config');
var apiai = require('apiai');

var app = apiai(config.apiai);

var use = function(text, cb) {
    var request = app.textRequest(text, {
        sessionId: '2'
    });

    request.on('response', function(response) {
        cb(response);
    });

    request.on('error', function(error) {
        console.log(error);
    });

    request.end();
};

module.exports = use;

// use("Hello how are you", function () {});
// use("What's the weather in Philadelphia", function () {});
// use("What's your age", function () {});
// use("translate to spanish", function (response) {
//     response = response.result;
//     if (response.action === "translate") {
//         var language = response.parameters.language;
//         var speech = response.fulfillment.messages[0].speech;
//         // say(speech);
//         console.log(speech);
//     }
// });