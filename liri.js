//require the node npm packages
var fs = require("fs");
var Twitter = require("twitter");
var spotify = require("spotify");
var request = require("request");
var inquirer = require("inquirer");

//grabbing the twitter authentication details from keys.js file
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;

//twitter user-based authentication
var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
});


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
    var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&tomatoes=true&r=json";
    request(movieQueryURL, function(error, response, body) {

        console.log("Title: " + JSON.parse(body).Title);
        console.log("Year: " + JSON.parse(body).Year);
        console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
        console.log("Country of origin: " + JSON.parse(body).Country);
        console.log("Language: " + JSON.parse(body).Language);
        console.log("Plot: " + JSON.parse(body).Plot);
        console.log("Actors: " + JSON.parse(body).Actors);
        console.log("Rotten Tomatoes Rating:  " + JSON.parse(body).tomatoUserRating);
        console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);

    });
}


inquirer.prompt([{
    type: "list",
    message: "What would you like to do today?",
    choices: ["Check your tweets?", "Spotify a song", "Find details of a movie?", "Surprise me?!!"],
    default: ["Check your tweets?"],
    name: "commands"

}]).then(function(user) {

    fs.appendFile("log.txt", "\n" + user.commands[0]);

    switch (user.commands) {
        case "Check your tweets?":
            {
                myTweets();
                break;
            }
        case "Spotify a song":
            {
                inquirer.prompt([{
                    type: "input",
                    message: "Enter a song: ",
                    name: "songName",
                    default: "The Sign by ace of base"
                }]).then(function(song) {
                    var song = song.songName;
                    if(song===undefined){
                        song="The Sign by ace of base";
                    }
                    spotifySong(song);
                });

                break;
            }
        case "Find details of a movie?":
             {
                inquirer.prompt([{
                    type: "input",
                    message: "Enter a movie: ",
                    name: "movieName"
                }]).then(function(movie) {
                    var movie = movie.movieName;
                    if (movie === undefined) {
                        movie = "Mr.Nobody";
                    }   
                    movieDetails(movie);
                });

                break;
            }
        case "Surprise me?!!":
            {

                fs.readFile("random.txt", "utf-8", function(err, data) {
                    if (err) throw err;

                    data = data.split(",");
                    if (data[0] === "Spotify a song") {
                        spotifySong(data[1]);
                    } else if (data[0] === "Check your tweets?") {
                        myTweets();
                    } else if (data[0] === "Find details of a movie?") {
                        movieDetails(data[1]);
                    }
                })
                break;
            }
    }
});

