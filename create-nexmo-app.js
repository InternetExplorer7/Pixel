var Nexmo = require('nexmo')
var fs = require('fs')
const config = require('./config')

const pKey = fs.readFileSync("./private.key");

module.exports = new Nexmo({
  serverHost: config.SERVER_HOST,
  apiKey: "3a3e7bc8",
  apiSecret: "042e9b175ce6f246",
  applicationId: "b49284a9-39cd-49b3-a449-837cc2e45ede",
  privateKey: pKey
}, {
  debug: false
});