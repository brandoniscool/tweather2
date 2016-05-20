var app = require('./app');
var config = require('./config');
var request = require('request');

//This is our array of twitter accounts that we're randomly sampling from.

exports.tweetMention = function(username) {
  var cities = config.majorcities;
  var len = cities.length;
  var city = cities[Math.floor(Math.random()*len)]
  var mention = '@' + username + ' hey! I can give you weather information. Tweet me something like: \"What\'s the weather in ' + city + '?\"';
  app.T.post('statuses/update', {status: mention }, function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully mentioned');
    }
  });
}
