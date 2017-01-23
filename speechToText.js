var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
const config = require('./config');
var fs = require('fs');
const nexmo = require('./create-nexmo-app');
const wit = require('node-wit');
var natural = require('natural');
const sayStocks = require('./components/stocks');
const client = new wit.Wit({
  accessToken: config.witStocks
});
const weatherClient = new wit.Wit({
  accessToken: config.witWeather
})
const translate = require("./googleTranslation");


function say(text, cb) {
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

var ding = function(cb) {
  if (cb === null || typeof cb === "undefined") {
    cb = function() {};
  }
  nexmo.calls.stream.start(
    global.nexmoID, {
      stream_url: [
        'http://phone-assistant-yehyaawad.c9users.io/ding.mp3'
      ],
      loop: 1,
      cb
    });
};

var speech_to_text = new SpeechToTextV1({
  "password": "IB8ycZRr7LoK",
  "username": "9df00a21-d687-4e43-8fab-0cd5b858f119"
});

var params = {
  model: 'en-US_BroadbandModel',
  content_type: 'audio/l16; rate=16000',
  continuous: true,
  'interim_results': true,
  'max_alternatives': 10,
  'word_confidence': true,
  timestamps: false,
  keywords: ['Ok', 'okay', 'Pixel', 'hello pixel', 'hey pixel', 'Hey Pixel', 'Okay', 'Calendar', 'Call', "apple", 'stock', 'flight', 'stocks', 'google', 'flights'],
  'keywords_threshold': 0.1
};

// Create the stream.
var recognizeStream = speech_to_text.createRecognizeStream(params);

// Get strings instead of buffers from 'data' events.
recognizeStream.setEncoding('utf8');

// Listen for events.

// recognizeStream.on('results', function(event) {
//   // onEvent('Results:', event);
//   try {
//     console.log('test: ' + JSON.stringify(event.results[0].alternatives[0].transcript));
//   }
//   catch (exep) {}
//   if (event.results[0].alternatives[0].transcript.indexOf("apple") > -1) {
//     // dinger();
//     console.log('Ding!');
//   }
//});

const THRESHOLD = 0.2;
const INTENTS = ['stocks', 'weather', 'flights'];

recognizeStream.on('data', function(event) {
  const firstTwo = event.split(' ').slice(0, 2).join(' ').toLowerCase();
  const inquiry = event.split(' ').slice(2).join(' ').toLowerCase();
  console.log("DATA: ", event);
  console.log("FIRST TWO WORDS: ", firstTwo)
  console.log("DISTANCE: ", natural.JaroWinklerDistance(firstTwo, "Hello Pixel"));

  // Check if user invokes Pixel
  const jW = natural.JaroWinklerDistance(firstTwo, "hello Pixel");

  if (jW > 0.7) {
    // Compare each word after Hello Pixel to intents and select highest matching intent
    var max = 0;
    var intent = '';
    event.split(' ').slice(2).forEach((word) => {
      for (var i = 0; i < INTENTS.length; i++) {
        var tempjW = natural.JaroWinklerDistance(word, INTENTS[i]);
        if (tempjW > max && tempjW > THRESHOLD) {
          intent = INTENTS[i];
          max = tempjW;
        }
      }
    })
    if (max == 0) {
      say("Sorry, I didn't catch that."); // Go to cleverbot
      return;
    }

    switch (intent) {
      case INTENTS[0]: //stocks
        sayStocks(event.split(' ').slice(2).join(' ').toLowerCase());
        break;
      case INTENTS[1]: //weather
        weatherClient.message(inquiry, {})
          .then((response) => {
            console.log("HERE IS A RESPONSE FROM WIT: ", JSON.stringify(response))
          })
          .catch((err) => {
            console.error(err);
            return;
          })
        break;
      case INTENTS[2]: //flights
        //...
        break;
    }
  }
});

recognizeStream.on('error', function(event, err) {
  console.error('Error with recognize stream:', err);
});
recognizeStream.on('close', function(event) {
  console.log("CLOSED RECOGNIZE STREAM");
});
recognizeStream.on('speaker_labels', function(event) {
  onEvent('Speaker_Labels:', event);
});

// Displays events on the console.
function onEvent(name, event) {
  console.log(name, event);
};

module.exports = recognizeStream;


// Ivan: setting recognize stream as global for use outside this file
global.speechStream__ = recognizeStream;
