const cheerio = require('cheerio')

const appender = require('./append');

module.exports = {

	parseVideo : function (video) {

		const $ = cheerio.load(video);

		var textNode = $('body > script').map((i, x) => x.children[0])
 	               .filter((i, x) => x && x.data.match(/__NEXT_DATA__/)).get(0);

		if (textNode){

			var scriptText = textNode.data.replace(/__NEXT_DATA__ =/g,'"data":');
			var firstLine = '{' + scriptText.split('\n')[1] + '}';
	        	var sources    = JSON.parse(firstLine);

			//console.log(JSON.stringify(sources));

			var eventType = sources.data.props.pageProps.eventType;
			var thumbnail = sources.data.props.pageProps.thumbnail;
			var title = sources.data.props.pageProps.title;
			var subtitle = sources.data.props.pageProps.subtitle;
			var awayTeamName = sources.data.props.pageProps.awayTeamName;
			var homeTeamName = sources.data.props.pageProps.homeTeamName;
			var gameDate = sources.data.props.pageProps.gameDate;
			var id = sources.data.props.pageProps.id;

var newJson = {gameDate:gameDate,homeTeamName:homeTeamName,awayTeamName:awayTeamName,title:title,subtitle:subtitle,id:id};
//			console.log(gameDate + ' ' + homeTeamName + ' - ' + awayTeamName + '\n'+title + ' - ' + subtitle + '\n'+'<a href=\"\">VIDEO</a>');
//console.log(newJson);
			appender.append(newJson);
   		}

	}
}
