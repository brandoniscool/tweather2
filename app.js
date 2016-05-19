var Twit = require('twit');
var Retweet = require('./retweet');
var Reply = require('./reply');
var config = require('./config');

var T = new Twit(config);

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

    T.screen_name = result.data.screen_name

    setInterval(function () {
      T.get('statuses/user_timeline', Retweet.sampleAccounts(), function(err, data, response) {
        Retweet.postRetweet(data[0].id_str);
      });
    }, 1000*180);

    var stream = T.stream('user');
    stream.on('connect', function (request) {
      console.log("Attempting a Twitter streaming connection.");
    });

    // Connection opened
    stream.on('connected', function (res) {
      console.log("Successfully streaming...");
    });
    //
    stream.on('tweet', Reply.tweetEvent);
    //
    // stream.on('error', function (res) {
    // });
  });

exports.T = T;
