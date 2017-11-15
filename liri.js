// Get access to API keys data
const API_ACCESS = require('./keys.js');

// Load all modules needed
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

// Get all command line arguments
const nodeArgs = process.argv;
// Get command input
const command = nodeArgs[2];
// Get song or movie input for Spotify or OMDB commands 
let title = '';
// Capture all the words in the title (ignoring the 1st 3 node arguments)
for (let i = 3; i < nodeArgs.length; i++) {
	title = (`${title} ${nodeArgs[i]}`).trim();
}

// Send command to Liri
liriCommands(command, title);


// Determines which command will run based on user input
function liriCommands(command, title) {

	// Use switch statement to choose command
	switch(command) {
		// node liri.js my-tweets
		case 'my-tweets': 
			myTweets();
			break;
		// node liri.js spotify-this-song [song name]
		case 'spotify-this-song':
			spotifyThisSong(title);
			break;
		// node liri.js movie-this [movie title]
		case 'movie-this':
			movieThis(title);
			break;
		// node liri.js do-what-this 
		case 'do-what-it-says':
			doWhatItSays();
			break;

		default:
			console.log(`${command} is not an accepted command.`);
	}
}


// Determines liri command based on 'random.txt' file 
function doWhatItSays() {
 
	// Use 'fs' library to read text from 'random.txt' file
	fs.readFile('./random.txt', 'utf8', (err, data) => {
		if(err) throw err

		// Separate the command and title strings
		const dataArray = data.split(',');
		const fileCommand = dataArray[0].trim();
		const fileTitle = dataArray[1].trim();

		// Run Liri commands with input from file
		liriCommands(fileCommand, fileTitle);
	});
}

// Use request module to get movie info from OMDB
function movieThis(movieTitle) {

	// Set default movie
	if (movieTitle === '') {
		movieTitle = 'Mr.Nobody';
	}

	const ombdApiKey = API_ACCESS.omdbKey.api_key;
	const requestURL = `http://www.omdbapi.com/?apikey=${ombdApiKey}&t=${movieTitle}`;

	// Make request to OMDB API 
	request(requestURL, (error, response, body) => {
		if (error) throw error;

		// Convert the JSON string 'body' into JSON object
		const movieInfo = JSON.parse(body);

		// Print desired movie info
		printMovieInfo(movieInfo);
	});
}

// displays movie info using OMDB JSON object
function printMovieInfo(movieInfo) {

	console.log(`\nMovie Info`);
	console.log(`--------------`);
	console.log(`Title: ${movieInfo.Title}`);
	console.log(`Year: ${movieInfo.Year}`);
	console.log(`IMDB Rating: ${movieInfo.imdbRating}`);
	console.log(`Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}`);
	console.log(`Country: ${movieInfo.Country}`);
	console.log(`Language: ${movieInfo.Language}`);
	console.log(`Plot: ${movieInfo.Plot}`);
	console.log(`Actors: ${movieInfo.Actors} \n`);
}


// Use spotify module to get song data
function spotifyThisSong(songName) {
	// create spotify client using keys 
	const spotify = new Spotify({
		id: API_ACCESS.spotifyKeys.client_ID,
		secret: API_ACCESS.spotifyKeys.client_secret
	});

	// Default song if no song is provided
	if (songName === '') {
		songName = 'The Sign Ace of Base';
	}

	// make request to API (using Promises instead of callbacks)
	spotify
		.search({type: 'track', query: songName, limit: 1})
		.then(response => {
			let trackInfo = response.tracks.items[0];

			// Display track info
			printSongInfo(trackInfo);
			
		})
		.catch(err => {
			console.log('Error: ' + err);
		});
}

// Format and display track information
function printSongInfo(trackInfo) {

	// Set up artists display
	const artists = trackInfo.artists; // array
	let artistDisplay = '';
	// Loop through artists array
	artists.forEach(artist => {
		if (artist === artists[artists.length-1]) {
			// No comma for last artist displayed
			artistDisplay = artistDisplay + artist.name;  
		} else {
			artistDisplay = artistDisplay + artist.name + ', ';
		}
	});

	// Display track info in terminal
	console.log('\nSong Info');
	console.log('-------------');
	console.log(`Artist(s): ${artistDisplay}`);
	console.log(`Song Name: ${trackInfo.name}`);
	console.log(`Preview Link: ${trackInfo.preview_url}`);
	console.log(`Album: ${trackInfo.album.name}\n`);
}


// Use twitter module to display last 20 tweets
function myTweets() {
	// Create twitter client using keys stored in './keys.js'
	const client = new Twitter({
		consumer_key: API_ACCESS.twitterKeys.consumer_key,
		consumer_secret: API_ACCESS.twitterKeys.consumer_secret,
		access_token_key: API_ACCESS.twitterKeys.access_token_key,
		access_token_secret: API_ACCESS.twitterKeys.access_token_secret,
	});

	// twitter screen_name that will be used
	const params = {screen_name: 'justCode_it'};

	// request
	client.get('statuses/user_timeline', params, (error, tweets, response) => {

		if (error) throw error;

		// Display tweets 
		printTweets(tweets, params.screen_name);
	});
}


// Prints last 20 tweets
function printTweets(tweets, screenName) {

	console.log(`\nLast 20 tweets from @${screenName}`);
	console.log('-----------------------------------');

	// Loop trough 20 tweets and format
	for (let i = 0; i < 20; i++) {
		console.log(`-${i+1}. \nCreated at: ${tweets[i].created_at} \nTweet: ${tweets[i].text} \n`);
	}
}


























