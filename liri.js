var keys = require("./keys.js");
var moment = require("moment");
var command = process.argv[2];
var userInput = "";


for(var i = 3; i < process.argv.length; i++){
    userInput += process.argv[i] + " ";
} 
liri();

function liri(){
    writeToLog();
    switch (command){
        case "spotify-this-song":
            spotifyThisSong();
            break;
        case "my-tweets":
            myTweets();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-what-it-says":
            doThis();
            break;
        default:
            console.log(`Cannot run command: ${command}`);
    }
}

function writeToLog(){
    var fs = require("fs");
    var time = moment().format();
    fs.appendFile("log.txt", `${time} ${command} ${userInput}\n`, function (err){
        if (err){
            return console.log(err);
        }
    });
}

function spotifyThisSong(){
    if (userInput === "")
        userInput = "The Sign"
    console.log(`Searching for ${userInput}`);

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
        id: keys.spotifyKeys.id,
        secret: keys.spotifyKeys.secret
    });
    
    spotify.search({ type: 'track', query: userInput }, function(err, data) {
        if (err) 
            return console.log('Error occurred: ' + err);
        var items = data.tracks.items;

        if(items.length === 0){
            console.log("No results found")
        } else {
            for (var i = 0; i < items.length; i++){
                console.log("\nArtist Name: " + items[i].album.artists[0].name);
                console.log("Album Name: " + items[i].album.name);
                console.log("Album link: " + items[i].album.external_urls.spotify + "\n");
            }
        }
    });
}

function myTweets(){
    var Twitter = require('twitter');

    console.log("Loading keys...");
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });

    var params = {screen_name: 'gaahmamhaag'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for(var i = 0; i < tweets.length; i++){
                var time = tweets[i].created_at.split("+")
                console.log("\nTweet: " + tweets[i].text);
                console.log("Tweeted: " + time[0].trim() + "\n");     
            }
        } else {
            console.log(error);
        }
    });
}

function movieThis(){
    var request = require("request");
    if (userInput === "")
        userInput = "Mr. Nobody";
    var queryUrl = `http://www.omdbapi.com/?t=${userInput}&y=&plot=short&apikey=40e9cece`;
    
    request(queryUrl, function(error, response, body){
        if(!error && response.statusCode === 200){
            var bodyObj = JSON.parse(body, null, 2);
            if(bodyObj.Response === "False"){
                console.log("No results");
                return;
            }
            //console.log(bodyObj);
            var year = bodyObj.Released;
            year = year.split(" ");
            console.log(`\nTitle: ${bodyObj.Title}`)
            console.log(`Year: ${year[2]}\nIMDB: ${bodyObj.imdbRating}`);
            if(bodyObj.Ratings[1].Source === "Rotten Tomatoes"){
                console.log(`${bodyObj.Ratings[1].Source}: ${bodyObj.Ratings[1].Value}`);
            }
            console.log(`Filmed in: ${bodyObj.Country}\nLanguage: ${bodyObj.Language}`);
            console.log(`Plot: ${bodyObj.Plot}\nActors: ${bodyObj.Actors}`);
        }
    });
}

function doThis(){
    var fs = require("fs");
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) 
            return console.log(err);
        //console.log(data);  
        var liriDo = data.split(" ");
        command = liriDo[0];
        userInput = "";
        for (var i = 1; i < liriDo.length; i++){
            userInput += liriDo[i] + " ";
        }
        liri();
    });
}




