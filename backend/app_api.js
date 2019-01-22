const request = require('request');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('auth')
});


lineReader.on('line', function (line) {
	handleRequest(String(line))
});


function handleRequest(auth) {

	var currentDate = new Date();
	var dd = currentDate.getDate();
	var ddNext = currentDate.getDate() + 1;
	var mm = currentDate.getMonth()+1; //January is 0!
	var yyyy = currentDate.getFullYear();

	if(dd<10) { dd = '0'+dd } 
	if(mm<10) { mm = '0'+mm } 
	if(ddNext<10) { ddNext = '0'+ddNext}

	// 2018-09-14
	today = yyyy+'-'+mm + '-' + dd;
	next = yyyy+'-'+mm+'-'+ ddNext;
	

	lineReader.close();

	const options = {
		url: 'https://api.liiga-services.telia.fi/api/clips/search?dateFrom='+today+'&dateTo='+next,
		headers: {
			'Accept': 'application/json',
			'Content-Type':'application/json',
			'Authorization': auth
		}
		};
		
		console.log(options.url)
	
	request(options,  (err, res, body) => {
		handleData(err, body);
	});

	
/* 	var fs = require('fs');
	var obj;
	fs.readFile('results_old.json', 'utf8', function (err, data) {
		handleData(err, data);
	}); */

}


function handleData(error, data) {
	if (error) throw error;

	obj = JSON.parse(data);

	obj2 = obj[Object.keys(obj)[0]].reverse()

	var json = [];

	for (var myKey in obj2) {

		var title;
		var subtitle = "";
		var date;
		var eventTime;

		if (obj2[myKey].clip.title != "Otteluennakko") {

			if (obj2[myKey].event != null) {
				title = obj2[myKey].event.title;
				subtitle = obj2[myKey].event.description;
				date = new Date(obj2[myKey].event.occurredAt);
				eventTime = obj2[myKey].event.time;
			} else {
				title = obj2[myKey].clip.title;
				date = new Date(obj2[myKey].game.start);
				eventTime = obj2[myKey].game.state.time;
			}
			var awayTeamName = obj2[myKey].game.awayTeam.abbrv;
			var homeTeamName = obj2[myKey].game.homeTeam.abbrv;

			var gameDate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
			var id = obj2[myKey].id;

			var newJson =
			{
				_id: id,
				gameDate: gameDate,
				homeTeamName: homeTeamName,
				awayTeamName: awayTeamName,
				title: title,
				subtitle: subtitle,
				eventTime: eventTime
			};
			json.push(newJson);

		}
	}

	clipInDb(json, [])
}

function clipInDb(json, newClips) {
	MongoClient.connect(url, function (err, db) {
		if (err) throw err;
		findClip(json, newClips, db, function (insertData, db) {
			var dbo = db.db("botti");
			if (insertData.length > 0) {
				dbo.collection('clips').insertMany(insertData, function (err, records) {
					if (err) throw err;
					if (records) writeResult(db);
				});
			} else {
				db.close();
			}
		});
	});
}

function findClip(json, newClips, db, callback) {
	if (json[0]) {
			var dbo = db.db("botti");
			dbo.collection('clips').find({ _id: json[0]["_id"] }).toArray(function (err, result) {
			if (err) throw err;
			if (result && result.length == 0) newClips.push(json[0])
			findClip(json.slice(1), newClips, db, callback)
		});
	} else {
		callback(newClips, db)
	}
}

function writeResult(db) { 
	var dbo = db.db("botti");
	dbo.collection('clips').find({ }).toArray(function(err, result) {
		if (err) throw err;
		require('fs').writeFile("results_sorted.json", JSON.stringify(result),'utf8',(error)=>{
			if (error != null) console.log(error);
			db.close();
			process.exit()
		});
	});

}