var app = require('./app');
var config = require('./config');
var request = require('request');

//This is our array of twitter accounts that we're randomly sampling from.

exports.tweetLike = function(data) {
    var tweets = data.statuses;
    var randomTweet = app.randIndex(tweets);
    if(typeof randomTweet != 'undefined') {
      app.T.post('favorites/create', {id: randomTweet.id_str}, function (err, data, response) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully liked');
        }
      });
    }
}
