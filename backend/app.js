const request = require('request');
const parser = require('./parse');

var first = 4738;
var last = 4738;

var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('counter')
});

lineReader.on('line', function (line) {
	first = Number(line);
	last = first;
	getAndParse(Number(line)+1, loopBack);  
});


function loopBack(response, id) {
	if (response == 200) { last = id; }

	if (id < first +10) {
		getAndParse(id+1, loopBack);
	} else {
		var fs = require('fs');
		fs.writeFile("counter", last, function(err) {
    			if(err) {
        			return console.log(err);
    			}
		}); 		
	}
}


function getAndParse(id, callback) {
	// console.log(id);
	request('https://videos.liiga-services.telia.fi/share/'+id,  (err, res, body) => {
		if (err) { return console.log(err); }
		parser.parseVideo(body);
		return callback(res && res.statusCode, id);
	});
}
