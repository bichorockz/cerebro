require('dotenv').load();

var Botkit = require('botkit');
var cfenv = require('cfenv');
var express = require('express');
var middleware = require('botkit-middleware-watson')({
  username: process.env.CONVERSATION_USERNAME,
  password: process.env.CONVERSATION_PASSWORD,
  workspace_id: process.env.WORKSPACE_ID,
  url: process.env.CONVERSATION_URL || 'https://gateway.watsonplatform.net/conversation/api',
  version_date: '2017-05-26'
});

var slackController = Botkit.slackbot();
var slackBot = slackController.spawn({
  token: process.env.SLACK_TOKEN
});

slackController.hears(['.*'], ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  slackController.log('Slack message received');
  middleware.interpret(bot, message, function() {
    if (message.watsonError) {
      console.error(message.watsonError);
      bot.reply(message, "Sorry, I'm having trouble connecting...");
    } else {
      bot.reply(message, message.watsonData.output.text.join('\n'));
    }
  });
});

slackBot.startRTM();

var app = express();
var appEnv = cfenv.getAppEnv();

app.listen(appEnv.port, '0.0.0.0', function() {
  console.log('Server starting on ' + appEnv.url);
});
