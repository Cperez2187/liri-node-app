// Get access to API keys data
const API_ACCESS = require('./keys.js');
const Twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');

// twitter

// Get command from user
const command = process.argv[2];
// Get song or movie input for Spotify or OMDB commands 
const title = process.argv[3];
// test
console.log(command);
console.log(title);

switch(command) {

	case 'my-tweets': 
		myTweets();
		break;

	case 'spotify-this-song':
		spotifyThisSong(title);
		break;

	default:
		console.log(`${command} is not an accepted command.`);
}


// Use spotify module to get song data
function spotifyThisSong(songName) {
	// create spotify client using keys 
	const spotify = new Spotify({
		id: API_ACCESS.spotifyKeys.client_ID,
		secret: API_ACCESS.spotifyKeys.client_secret
	});

	// make request to API (using Promises instead of callbacks)
	spotify
		.search({type: 'track', query: songName, limit: 1})
		.then(response => {
			console.log(response);
		})
		.catch(err => {
			console.log('Error: ' + err);
		});
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
		if (!error) {
			console.log(`Last 20 tweets from @${params.screen_name} \n`);

			for (let i = 0; i < 20; i++) {
				console.log(`-${i+1}. ${tweets[i].text} \n`);
			}
		}
	});
}