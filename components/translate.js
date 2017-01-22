const use = require("../api/apiai.js");
const nexmo = require('../create-nexmo-app');
const translate = require("../googleTranslation");
const ding = require("../ding");

var say = function(text, cb) {
    global.PIXEL(text);
    if (cb === null || typeof cb === "undefined") {
        cb = function() {};
    }
    nexmo.calls.talk.start(
        global.nexmoID, {
            text: text,
            voiceName: 'Emma',
            loop: 1
        },
        cb
    );
};

global.TRANSLATE_MODE = false;

var handleTranslate = function(text, cb) {
    use(text, function(response) {
        response = response.result;
        if (response.action === "translate") {
            ding();
            var language = response.parameters.language;
            var speech = response.fulfillment.messages[0].speech;
            if (language === "Spanish") {
                global.TRANSLATE_MODE = true;
                global.transcribeLang__ = "en-US";
                global.traslateLan__ = "es";
                global.translateSpeaker__ = "Penelope";
                global.resetGoogleSpeech__(); // reset transcriber to spanish
            }
            else {
                global.TRANSLATE_MODE = true;
                global.transcribeLang__ = "es-MX";
                global.traslateLan__ = "en";
                global.translateSpeaker__ = "Emma";
                global.resetGoogleSpeech__(); // reset transcriber to spanish
            }
        }
    });
};

module.exports = handleTranslate;
