require('dotenv').load({silent: true});
var express = require('express');
var app = express();
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');
require('./config/express')(app);
var escpos = require('escpos');


try {
  var device  = new escpos.USB();
  var printer = new escpos.Printer(device);
} catch(e) {
  console.log(e);
}


var toneAnalyzer = new ToneAnalyzerV3({
  version_date: '2017-09-21'
});



app.get('/', function(req, res) {
  res.render('index', {
    bluemixAnalytics: !!process.env.BLUEMIX_ANALYTICS,
  });
});

app.post('/print', function(req, res) {
  var poem = req.body.poem;
  print(poem);
})

app.post('/api/tone', function(req, res, next) {
  toneAnalyzer.tone(req.body, function(err, data) {
    if (err) {
      return next(err);
    }
    return res.json(data);
  });
});

function print(data) {
  if (printer) {
    device.open(function(err){
    printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text(data)
    .cut()
    .close()
  });
  }
}


require('./config/error-handler')(app);

module.exports = app;
