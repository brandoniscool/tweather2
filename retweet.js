var app = require('./app');
var config = require('./config');
var request = require('request');

//This is our array of twitter accounts that we're randomly sampling from.

exports.sampleAccounts = function() {
  var randWeatherAccount = app.randIndex(config.waccounts);
  var userObj = {
    screen_name: randWeatherAccount, //choosing random index
    count: 1 //we only need one tweet
  }
  return userObj;
}

exports.postRetweet = function(id) {
  app.T.post('statuses/retweet', { id: id }, function (err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log('Successfully retweeted');
    }
  });
}
