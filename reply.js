var app = require('./app');
var config = require('./config');
var request = require('request');
var Wolfram = require('node-wolfram');
var W = new Wolfram(config.wolfram_appid);

exports.tweetEvent = function (eventMsg) {
  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text.replace(/@[\S]*/g, '').replace(/^\s+|\s+$/g, ''); //removing the @mention for wolfram query and stripping excess whitespace
  var username = eventMsg.user.screen_name;

  var tweetWithWeather = '@' + username + " ";
//  if (from == app.T.screen_name) {
    if (concerningWeather(text)) {
      if (replyto === app.T.screen_name) {
        getWeather(text, username, function(status){
          sendTweet(tweetWithWeather + status);
        });
      }
    } else {
      deferredTweet(username);
    }
  //}
}

function deferredTweet(username) {
  var cities = config.majorcities;
  var len = cities.length;
  var city = cities[Math.floor(Math.random()*len)];
  var defer = '@' + username + ' thanks, but this tweet doesn\'t seem to concern weather. Try something like: \"What\'s the weather in ' + city + '?\"';
  sendTweet(defer);
}

function getWeather(query, username, callback) {
  console.log(query);
  W.query(query, function(err, result) {
  	if(err) {
      console.log(err);
    } else {
      if (result.queryresult.$.datatypes.match(/weather/gi)) {
        var str = result.queryresult.pod[1].$.title + " " + result.queryresult.pod[1].subpod[0].plaintext[0];
        var status = wolframParser(str);
        callback(status);
      } else {
        deferredTweet(username);
        return
      }
    }
  });
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
  //return str.match(/weather|forecast|tempurature|rain|snow|sunny/gi);
  return str.match(/weather|forecast|tempurature|rain|snow|sunny/gi);
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

/* Below is an implementation using OpenWeatherMap's API using zipcode lookup.
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
*/
