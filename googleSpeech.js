var handleText = require('./handleText');
const longpoll = require("./longpoll");

var speech = require('@google-cloud/speech')({
    projectId: 'striped-orbit-156403',
    keyFilename: './keyfile.json'
});

var recognizeStream;

global.transcribeLang__ = "en-US";

var reset = function() {
    if (recognizeStream) {
        // recognizeStream.close();
    }
    recognizeStream = speech.createRecognizeStream({
        config: {
            encoding: 'LINEAR16',
            sampleRate: 16000,
            languageCode: global.transcribeLang__,
            speechContext: {
                phrases: ["pixel", "Okay pixel", "Okay Pixel", "okay", "stock", "weather", "translate", "English", "traducir", "Ingles","introduce"]
            }
        },
        singleUtterance: false,
        interimResults: true
    });
    var data_arr = [];
    var event;
    recognizeStream.on('data', function(data) {
        //console.log("DATA: ",data);
        //data = removeDiacritics(data);
        //console.log("PROCESS DATA: ",data);
        console.log('data: ' + JSON.stringify(data));
        data_arr.push(data);
        if (data.endpointerType === 'END_OF_SPEECH') {
            // Send final string.
            console.log("COMMAND: ",data_arr[data_arr.length - 2].results);
            handleText(data_arr[data_arr.length - 2].results);
            global.resetGoogleSpeech__();
            // Reset
            data_arr = [];
        }
    });

    recognizeStream.on('error', function(error) {
        console.log('error: ' + error);
        this.emit( "end" );
        reset();
    });
    
    global.speech__ = recognizeStream;
    longpoll.reset();
};

reset();
longpoll.init();
longpoll.reset();

global.resetGoogleSpeech__ = reset;

module.exports = recognizeStream;