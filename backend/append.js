var fs = require('fs')

module.exports = {

        append : function (videoJson) {
		// console.log('INCOMING ' + videoJson);
		fs.readFile('results.json', function (err, data) {
			var json = JSON.parse(data);
			// console.log(json);
			json.push(videoJson);
			fs.writeFile("results.json", JSON.stringify(json));
		});
	}
}
