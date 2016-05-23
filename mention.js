var app = require('./app');
var config = require('./config');
var request = require('request');

//This is our array of twitter accounts that we're randomly sampling from.

exports.tweetMention = function(tweetObj) {
  var randCity = app.randIndex(config.majorcities);
  var mention = '@' + tweetObj.username + ' hey! I can give you weather information. Tweet me something like: \"What\'s the weather in ' + randCity + '?\"';
  app.T.post('statuses/update', tweetObj, function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully mentioned');
    }
  });
}
