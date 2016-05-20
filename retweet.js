var app = require('./app');
var config = require('./config');
var request = require('request');

//This is our array of twitter accounts that we're randomly sampling from.
var weatherAccounts = ['weatherchannel', 'twcbreaking', 'NWSNHC', 'nws', 'wunderground', 'JimCantore', 'CNNweather'];

exports.sampleAccounts = function() {
  var len = weatherAccounts.length;
  var userObj = {
    screen_name: weatherAccounts[Math.floor(Math.random()*len)], //choosing random index
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
