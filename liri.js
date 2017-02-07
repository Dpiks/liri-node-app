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
var twitterID = "deepika_vikas";
var twitterQueryURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=" + twitterID + "&count=20";

function myTweets() {
    client.get(twitterQueryURL, function(error, tweet, response) {
        if (!error) {
            for (let i = 0; i < tweet.length; i++) {
                console.log("Tweet " + (i + 1) + ": " + tweet[i].text + "\t created at: " + tweet[i].created_at);

            }
        }
    });

}

function spotifySong(song) {
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {
            console.log("Artists: " + data.tracks.items[0].artists[0].name);
            console.log("Song: " + data.tracks.items[0].name);
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }

    });
}

function movieDetails(movie) {
	var movieQueryURL="http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&r=json";
    request(movieQueryURL, function(error, response, body) {
        console.log("The movie's rating is: " + body);

    });
}

fs.appendFile("log.txt","\n" + process.argv.slice(2));

switch (commands) {
    case "my-tweets":
        {
        	
            myTweets();
            break;
        }
    case "spotify-this-song":
        {
        	
            var song = process.argv[3];
            if (song === undefined) {
                song = "The Sign by ace of base";
            }
            spotifySong(song);
            break;
        }
    case "movie-this":
        {
        	
            var movie = process.argv[3];
            if (movie === undefined) {
                movie = "Mr.Nobody";
            }
            movieDetails(movie);
            break;
        }
    case "do-what-it-says":
        {
        	
        	fs.readFile("random.txt", "utf-8", function(err,data){
        		if(err) throw err;

        		data=data.split(",");
        		if(data[0]==="spotify-this-song"){
        			spotifySong(data[1]);
        		}else if(data[0]==="my-tweets"){
        			myTweets();
        		}else if(data[0]==="movie-this"){
        			movieDetails(data[1]);
        		}
        	})
            break;
        }


}
