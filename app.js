var Twit = require('twit');
var Retweet = require('./retweet');
var Reply = require('./reply');
var config = require('./config');

var T = new Twit(config);

// Twit has promise support; you can use the callback API,
// promise API, or both at the same time. We'll wait until we can successfully auth our app, then store our username on the T object.
//
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
    }, 1000*180); //This line determines interval time, in miliseconds.

    // Opening up streaming connection to Twitter
    // dev.twitter.com/streaming/overview
    var stream = T.stream('user');

    //Emitted when a connection attempt is made to Twitter. The http request object is emitted.
    stream.on('connect', function (request) {
      console.log("Attempting a Twitter streaming connection.");
    });

    // Emitted when the response is received from Twitter. The http response object is emitted.
    stream.on('connected', function (res) {
      console.log("Successfully streaming...");
    });

    // Emitted each time a status (tweet) comes into the stream.
    stream.on('tweet', Reply.tweetEvent);

    // Emitted when an API request or response error occurs.
    // stream.on('error', function (res) {
    // });
  });


//Making this variable accessible to our other libraries
exports.T = T;
