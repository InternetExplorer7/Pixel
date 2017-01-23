const config = require('../config');
const wit = require('node-wit');
const client = new wit.Wit({
  accessToken: config.witStocks
});
const request = require('request');
const nexmo = require('../create-nexmo-app');
const googleStocks = require('google-stocks');

var myMap = new Map();
myMap.set('microsoft', 'MSFT');
myMap.set('facebook', 'FB');
myMap.set('google', 'GOOG');

module.exports = function(input) {
  // say('The all time high for Microsoft today was sixty two dollars and eighty two cents. It opened at sixty two dollars and sixty seven cents and plunged down to a low of sixty two dollars and thirty seven cents.')
  client.message(input, {})
    .then((response) => {
      const companyName = response.outcomes[0].entities.stock_name[0].value.toLowerCase();
      if (!companyName) {
        say('Sorry! I could not find stock information for that company!');
      }
      else {
        // Otherwise - a company name was found.
        googleStocks([myMap.get(companyName)], function(error, data) {
          say('The last price for ' + companyName + ' was at $' + data[0].l);
        });
      }
    });
}

function say(text, cb) {
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