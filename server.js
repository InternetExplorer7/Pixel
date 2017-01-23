'use strict';

const config = require('./config');
const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;
var request = require('request');
const path = require('path');

var nexmo = require('./create-nexmo-app');

let app = express();

// Serve static files from 'client' dir
app.use(express.static(__dirname + '/public'));


// Parse incoming POST params with Express middleware
app.use(urlencoded({
  extended: false
}));

var first = true;

app.post('/voice', (req, res) => {

  console.log("CALL FROM: ", req.body.From);

  let twiml = new twilio.TwimlResponse();

  twiml.dial((dialNode) => {
    console.log("CALL FROM: ", req.body.From);
    
    if (config.BLACKLIST.has(req.body.From)) {
      twiml.say('Your number has been blacklisted.  Do not call again.');
      res.send(twiml.toString());
      return;
    }

    if (req.body.From === "+" + config.NEXMO_NUM) {
      console.log("RECOGNIZED CALL FROM NEXMO NUMBER");
      startConference(dialNode, true, false, true, false);
    }
    else {
      if (first) {
        global.client_num = req.body.From;
        first = false;
      }
      console.log("RECOGNIZED CALL FROM NON-NEXMO NUMBER");
      startConference(dialNode, true, true, false, true);
    }
  });

  res.send(twiml.toString());
});

function startConference(dialNode, startConferenceOnEnter, endConferenceOnExit, doBeep, doCallTwilio) {
  dialNode.conference(config.CCNAME, {
    startConferenceOnEnter: startConferenceOnEnter,
    endConferenceOnExit: endConferenceOnExit,
    beep: doBeep
  })
  if (doCallTwilio) {
    console.log("CALLING TWILIO");
    callTwilio();
  }
}

var http = require('http');

app.server = http.createServer(app);
app.server.listen(process.env.PORT, "0.0.0.0", null, function() {
  console.log('Example app listening on port ' + process.env.PORT);
  console.log('0.0.0.0:' + process.env.PORT);
  console.log("SETTING UP NEXMO");
  require('./nexmoWebsocket.js')(app.server);
  // setupLongPoll();
});


function callTwilio() {
  nexmo.number.get({}, function(err, data) {
    console.log("GETTING NUMBERS");
    if (err) {
      console.log("ERROR GETTING NUMBERS!");
      return;
    }
    console.log("MAKING CALL FROM: ", config.NEXMO_NUM);
    var eventUrl = "http://" + config.SERVER_HOST + "/events";
    nexmo.calls.create({
      to: [{
        type: 'phone',
        number: config.TWILIO_NUM
      }],
      from: {
        type: 'phone',
        number: config.NEXMO_NUM
      },
      answer_url: ["http://" + config.SERVER_HOST + '/ncco-intial-connection.json']
    }, (err, res) => {
      if (err) {
        console.log("ERROR INITIATING NEXMO CALL");
        return;
      }
      console.log("Call success: ", res)
      global.nexmoID = res.uuid;
      console.log('nexmoID', global.nexmoID);
    });
  })
}

global.SERVER = app;