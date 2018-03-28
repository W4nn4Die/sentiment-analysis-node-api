console.log('🚀  Server is starting');

//////////////////////////////////////////////////////////////////////////////////////////

// fs module -> File system access
let fs = require('fs');

let dataWords = fs.readFileSync('additionals.json');
let dataAfinn = fs.readFileSync('afinn-111.json');

let additionals = JSON.parse(dataWords);
let afinn = JSON.parse(dataAfinn);

//////////////////////////////////////////////////////////////////////////////////////////

// express module -> Web framework built on top of http
let express = require('express');
let app = express();

//////////////////////////////////////////////////////////////////////////////////////////

// cors module
let cors = require('cors');
app.use(cors());

//////////////////////////////////////////////////////////////////////////////////////////

// body-parser -> module to parse POST data
let bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

//////////////////////////////////////////////////////////////////////////////////////////

// server
let server = app.listen(3000, listening);

// callback function
function listening() {
	console.log("-----------------------------------------------");
	console.log('🤖  listening...');
}

//////////////////////////////////////////////////////////////////////////////////////////

// serving the static page
app.use(express.static('public'));

//////////////////////////////////////////////////////////////////////////////////////////

// ROUTES

// GET - Add
app.get('/add/:word/:score?', addWord);

function addWord(req, res) {

	let word = req.params.word;
	let score = Number(req.params.score);
	let reply;

	if (!score) {
		reply = {
			msg: 'Score is required'
		}
		res.send(reply);
	} else {
		additionals[word] = score;
		let data = JSON.stringify(additionals, null, 2);
		fs.writeFile('additionals.json', data, finished);

		function finished(err) {
			console.log('successfully added...');
			reply = {
				word: word,
				score: score,
				status: "success"
			}
			res.send(reply);
		}
	}
	
}


// GET - All
app.get('/all', sendAll);

function sendAll(req, res) {
	let data = {
		additionals: additionals,
		afinn: afinn
	}
	res.send(data);
}


// GET - Search 
app.get('/search/:word/', searchWord);

function searchWord(req, res) {

	let searchWord = req.params.word;
	let reply;

	// console.log(additionals[searchWord]);
	// console.log(afinn[searchWord]);

	if (additionals[searchWord] || afinn[searchWord]) {
		reply = {
			status: "found",
			word: searchWord,
			score: additionals[searchWord] || afinn[searchWord]
		}
	} else {
		reply = {
			status: "not found",
			word: searchWord,

		}
	}

	res.send(reply);
}


// POST - Sentiment Analysis
app.post('/analyze', analyzeThis);

function analyzeThis(req, res) {
	let txt = req.body.text;
	let words = txt.split(/\W+/);
	let totalScore = 0;
	let wordlist = [];

	for (let i = 0; i < words.length; i++) {

		let word = words[i];
		let score = 0;
		let found = false;

		if (additionals.hasOwnProperty(word)) {
			score = Number(additionals[word]);
			found = true;
		} else if (afinn.hasOwnProperty(word)) {
			score = Number(afinn[word]);
			found = true;
		}
		if (found) {
			wordlist.push({
				word: word,
				score: score
			});
		}
		totalScore += score;

	}

	let comp = totalScore / words.length;
	let reply = {
		score: totalScore,
		comparative: comp,
		word: wordlist
	}
	res.send(reply);

}