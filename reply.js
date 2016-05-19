var app = require('./app');
var config = require('./config');
var request = require('request');

exports.tweetEvent = function (eventMsg) {
  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text;
  var from = eventMsg.user.screen_name;
  var zip = extractZip(text);
  var tweetWithOutZip = '@' + from + ' thanks for tweeting me. Tweet me your zip and I\'ll reply with the weather!';
  var tweetWithZip = '@' + from;
  if (from != app.T.screen_name) {
    if (zip) {
      if (replyto === app.T.screen_name) {
        getWeather(zip, function(status){
          sendTweet(tweetWithZip + status);
          sendTweet(tweetWithZip + " More here: " + "https://weather.com/weather/today/l/" + zip + ":4:US");
        });
      }
    } else {
      sendTweet(tweetWithOutZip);
    }
  }
}

function sendTweet(text) {
  var tweetObj = {
    status: text
  };

  app.T.post('statuses/update', tweetObj, function(err, data, response) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully tweeted!");
    };
  });
}

function getWeather(zip, callback) {
  var weather_url = "http://api.openweathermap.org/data/2.5/weather?units=imperial&APPID=" + config.openweathermap_API_KEY + "&zip="+ zip + ",us";
  request(weather_url, function (err, response, body) {
    if (err) {
      console.log("Error getting weather for " + zip, err);
      return
    } else {
      var weather = JSON.parse(body);
      var status = " The forecast for " + weather.name +
          " today is " + weather.weather[0].main.toLowerCase() +
          ". High " + Math.round(weather.main.temp_max) + "° Low " + Math.round(weather.main.temp_min) +
          "°" + " Wind speed " + Math.round(weather.wind.speed) + " mph." + " Humidity " + weather.main.humidity +"%.";
      callback(status);
      console.log(status);
    }
  });
}

function extractZip(str) {
  var re = /\d{5}/g;
  return re.exec(str);
}

// function callback(err, data, response) {
//   var tweets = data.statuses;
//   for (var i = 0; i < tweets.length; i++) {
//     console.log(tweets[i].text);
//   }
// };
