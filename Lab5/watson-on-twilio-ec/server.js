var smsWatson = require('./sms-watson')

var express = require('express')
var bodyParser = require('body-parser')
var cfenv = require('cfenv')

var app = express()
var appEnv = cfenv.getAppEnv()

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/api/message', function(req, res) {
  var result = smsWatson.message(req.body.Body)
  res.send(result)
});

app.listen(appEnv.port, '0.0.0.0', function() {
  console.log('Running on ' + appEnv.url + '\n')
});
