//require the node npm packages
var fs = require("fs");
var twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");


//grabbing the twitter authentication details from keys.js file
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;

//twitter user-based authentication
var client = new twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
});

//console.log(client);

//grabbing the user command from the command line
var commands = process.argv[2];

//functions to execute based on user command
var twitterID="deepika_vikas";
var twitterQueryURL="https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + twitterID + "&count=20";
function myTweets() {
    client.get(twitterQueryURL, function(error, tweet, response) {
        if (!error) {
            for (let i = 0; i < tweet.length; i++) {
                console.log(tweet[i].created_at);
                console.log(tweet[i].text);
            }
        }
    });

}



switch (commands) {
    case "my-tweets":
        {
            myTweets();
            break;
        }
    case "spotify-this-song":
        {

            break;
        }
    case "movie-this":
        {

            break;
        }
    case "do-what-it-says":
        {

            break;
        }


}
