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

var rp = require('request-promise');

function toEventCentral (date) {
  rp(process.env.EVENT_CENTRAL_URL, { json: true }).then(function(result, err) {
    if (err) {
      console.error(err)
    } else {
      var sessions = result.data.sessions
      for (i = 0; i < sessions.length; i++) {
        if (sessions[i].StartDateTime.substring(0, 10) == date) {
          toTwilio(sessions[i].SessionTitle + ' @ ' + sessions[i].StartDateTime.substring(11, 16))
        }
      }
    }
  })
}

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
    if (response.context.date) {
      var date = response.context.date
      toEventCentral(date)
    }
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
