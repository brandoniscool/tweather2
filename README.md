<a name="README"><img src="http://i.imgur.com/ACxHvhk.jpg" width="600px"/></a>


# Tweather 2.0

This Twitter bot responds to @mentions with weather forecast data from [OpenWeatherMap](http://openweathermap.org) and selectively retweets interesting tweets from promising weather related accounts. Tweet a valid US zipcode to [@tweathertwo](https://twitter.com/tweathertwo) to try.

<img style="display:block;margin:0 auto;"src="http://i.imgur.com/JCYBCdU.jpg" width="400px"/>

------------------------------------------------


##Preparation and installation


####Install Node.js

[Node.js](http://nodejs.org)


####API Keys

Create a [Twitter Application](https://apps.twitter.com) and generate application keys.

Create an [OpenWeatherMap account](https://openweathermap.org) and generate an API Key.

You will have to update `config.js` with the keys obtained from Twitter Dev and OpenWeatherMap.

####Downloading, Installing and Running Locally

Clone GitHub repo:

```
git clone https://github.com/brandoniscool/tweather2
```

Change directory, install the node module dependencies, start bot:

```
cd tweather2
npm install
npm start
```
##Deploying to Amazon's EC2

1. Create an EC2 instance.
2. Generate and download private key file.
3. SSH into your instance.
4. SFTP copy files into your instance.
5. NPM install [forever](https://www.npmjs.com/package/forever) to allow your scripts to run continuously.

##Resources

- Twitter Developers - https://dev.twitter.com/
- OpenWeatherMap API Docs - http://openweathermap.org/current
- Node.js official documentation - https://nodejs.org/api/
- Node NPM Package Manager - https://www.npmjs.com/
- Getting Started with Amazon EC2 Linux Instances - http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html
