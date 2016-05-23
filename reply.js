var app = require('./app');
var config = require('./config');
var request = require('request');
var Wolfram = require('node-wolfram');

exports.TweetEvent = function (eventMsg) {
  var replyto = eventMsg.user.screen_name;
  var replyid = eventMsg.id_str;
  var query = eventMsg.text.replace(/@[\S]*/g, '').replace(/^\s+|\s+$/g, ''); //removing the @mention for wolfram query and stripping excess whitespace

  var tweetWithWeather = '@' + replyto + " ";
  if (replyto != app.T.screen_name) {
    if (concerningWeather(query)) {
      getWeather(query, eventMsg, function(status){
        sendTweet({status: tweetWithWeather + status, in_reply_to_status_id: replyid});
      });
    } else {
      deferredTweet(replyto, replyid);
    }
  }
}

function getWeather(query, eventMsg, callback) {
  console.log(query);
  app.W.query(query, function(err, result) {
  	if(err) {
      console.log(err);
    } else {
      if (result.queryresult.$.datatypes.match(/weather/gi)) {
        var str = result.queryresult.pod[1].$.title + " " + result.queryresult.pod[1].subpod[0].plaintext[0];
        var status = wolframParser(str);
        callback(status);
      } else {
        deferredTweet(eventMsg.user.screen_name, eventMsg.id_str);
        return
      }
    }
  });
}

function deferredTweet(replyto, replyid) {
  var city = app.randIndex(config.majorcities);
  var deferText = '@' + replyto + ' thanks, but this tweet doesn\'t seem to concern weather. Try something like: \"What\'s the weather in ' + city + '?\"';
  sendTweet({status: deferText, in_reply_to_status_id: replyid});
}

function wolframParser(str) {
  str = str.replace(/Latest recorded weather for /g, 'Weather for ');
  str = str.replace(/Result /, '');
  str = str.replace(/conditions\s\|\s/, '');
  str = str.replace(/temperature/, ' - temp');
  str = str.replace(/\s\°/gi, '°');
  str = str.replace(/\s\|/gi, ':');
  str = str.replace(/relative humidity/, 'rh');
  str = str.replace(/wind speed/g, 'ws');
  str = str.replace(/wind chill/g, 'wc');
  str = str.replace(/dew point/g, 'dp');
  str = str.replace(/\shour/g, 'h');
  str = str.replace(/\sminutes/g, 'm');
  str = str.replace(/\syear/g, 'y');
  str = str.replace(/\smph/g, 'mph - ');
  str = str.replace(/\s\s/g, ' ');
  str = str.replace(/\n/g, ' ');
  return str;
}

function concerningWeather(str) {
  return str.match(/weather|forecast|temperature|rain|snow|sun|drizzl|precipitation|cloud|hail|hail|hurricane|thunder/gi);
}

function sendTweet(tweetObj) {
  app.T.post('statuses/update', tweetObj, function(err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully tweeted!");
    };
  });
}
