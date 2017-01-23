var Nexmo = require('nexmo')
var fs = require('fs')
const config = require('./config')

const pKey = fs.readFileSync("./private.key");

module.exports = new Nexmo({
  serverHost: config.SERVER_HOST,
  apiKey: config.nexmoKey,
  apiSecret: config.nexmoSecret,
  applicationId: config.nexmoID,
  privateKey: pKey
}, {
  debug: false
});