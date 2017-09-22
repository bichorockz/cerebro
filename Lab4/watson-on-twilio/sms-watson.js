module.exports.message = toWatson

require('dotenv').config();

var ConversationV1 = require('watson-developer-cloud/conversation/v1')

var conversation = new ConversationV1({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  version_date: ConversationV1.VERSION_DATE_2017_05_26
})

var accountSid = process.env.TWILIO_ACCOUNT_SID
var authToken = process.TWILIO_AUTH_TOKEN

var twilio = require('twilio')
var client = new twilio(accountSid, authToken)

var context = {}

function toWatson (message) {
  conversation.message({
    workspace_id: process.env.WORKSPACE_ID,
    context: context,
    input: { text: message }
  }, processWatsonResponse)
}

function processWatsonResponse (err, response) {
  if (err) console.error(err)
  else {
    var message = response.output.text[0]
    context = response.context
    console.log('Watson says: "' + message + '"')
    toTwilio(message)
  }
}

function toTwilio (message) {
  client.messages.create({
    body: message,
    to: process.env.TWILIO_TO_NUMBER,
    from: process.env.TWILIO_FROM_NUMBER
  }, processTwilioResponse)
}

function processTwilioResponse (err, response) {
  if (err) console.error(err)
  else console.log(response.sid + '\n')
}
