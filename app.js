var Twit = require('twit');
var Wolfram = require('node-wolfram');
var Retweet = require('./retweet');
var Mention = require('./mention');
var Reply = require('./reply');
var Like = require('./like');
var config = require('./config');

var T = new Twit(config);
var W = new Wolfram(config.wolfram_appid);

// Twit has promise support; you can use the callback API,
// promise API, or both at the same time. We'll wait until we can successfully auth our app, then store our username on the T object.

T.get('account/verify_credentials', { skip_status: true })
  .catch(function (err) {
    console.log('caught error', err.stack)
  })
  .then(function (result) {
    // `result` is an Object with keys "data" and "resp".
    // `data` and `resp` are the same objects as the ones passed
    // to the callback.
    // See https://github.com/ttezel/twit#tgetpath-params-callback
    // for details.

    //Storing our username for further use. See line 12 at ./reply.js
    T.screen_name = result.data.screen_name

    //This is the core of our systematic retweeting.
    setInterval(function () {
      T.get('statuses/user_timeline', Retweet.sampleAccounts(), function(err, data, response) {
        Retweet.postRetweet(data[0].id_str);
      });
    }, 100000*180); //This line determines interval time, in miliseconds.

    //This is the core of our systematic retweeting.
    setInterval(function () {
      app.T.get('search/tweets', {q: 'weather', count: 5}, function(err, data, response) {
        if(err) {
          console.log(err);
        } else {
          Like.tweetLike(data);
        }
    }, 100000*50); //This line determines interval time, in miliseconds.

    setInterval(function () {
      T.get('search/tweets', {q: 'weather', count: 1}, function(err, data, response) {
        if (data.statuses[0].user) {
          Mention.tweetMention({username: data.statuses[0].user.screen_name, in_reply_to_status_id: data.statuses[0].in_reply_to_status_id});
        }
      });
    }, 100000*500); //This line determines interval time, in miliseconds.

    // Opening up streaming connection to Twitter
    // dev.twitter.com/streaming/overview
    var stream = T.stream('statuses/filter', { track: T.screen_name });

    //Emitted when a connection attempt is made to Twitter. The http request object is emitted.
    stream.on('connect', function (request) {
      console.log("Attempting a Twitter streaming connection.");
    });

    // Emitted when the response is received from Twitter. The http response object is emitted.
    stream.on('connected', function (res) {
      console.log("Successfully streaming...");
    });

    // Emitted each time a status (tweet) comes into the stream.
    stream.on('tweet', Reply.TweetEvent);

    // Emitted when an API request or response error occurs.
    // stream.on('error', function (res) {
    // });
  });

exports.randIndex = function(arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};
exports.handleError = function(err) {
  console.error('response status:', err.statusCode);
  console.error('data:', err.data);
}
//Making this variable accessible to our other libraries
exports.T = T;
exports.W = W;
