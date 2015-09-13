console.log('Loading express server...');

var _ = require('lodash');

var CLIENT_PATH = "./src/client/";
var prod = false;
process.argv.forEach(function (val, index, array)
{
	if(_.isString(array[2]) && array[2] === '--dev')
	{
		CLIENT_PATH = "./src/client/";
		prod = false;
	}
	else if(_.isString(array[2]) && array[2] === '--prod')
	{
		CLIENT_PATH = "./build/";
		prod = true;
	}
});

var express = require('express');
var app = express();
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/bower_components',  express.static('bower_components'));
app.use('/node_modules',  express.static('node_modules'));
if(prod === false)
{
	app.use('/src/client', express.static(CLIENT_PATH));
}
else
{
	app.use('/src/client', express.static('build'));
}
app.use('/src', express.static(CLIENT_PATH));
app.use('/', express.static(CLIENT_PATH));

app.get('/', function(req, res) {
	res.send('Cannot find an index.html. Ensure you have built your project via "gulp".');
});

//As a fallback, any route that would otherwise throw a 404 (Not Found) will be given to the
//home page, which will try to decompose the route and use the correct client-side route.
app.use(function(req, res)
{
    console.log('Falling back to ' + CLIENT_PATH + ' instead of ' + req.url);
    req.url = CLIENT_PATH + 'index.html';
});

var port = process.env.PORT || 8626;
console.log("Express port I'll use:", port);
app.listen(port, function() {
    console.log('Demo server started on port ' + port);
});

var api = require('../api/api');