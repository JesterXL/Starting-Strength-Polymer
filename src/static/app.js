console.log('Loading express server...');

var express = require('express');
var app = express();
var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/favicon.ico'));
app.use('/bower_components',  express.static('bower_components'));
app.use('/node_modules',  express.static('node_modules'));
app.use('/src', express.static('./src/client/'));
app.use('/', express.static('./src/client/'));

app.get('/', function(req, res) {
	res.send('Default Express server response. Perhaps you should run grunt serve --dev or --build');
	// res.sendFile('/client/index.html');
});

//As a fallback, any route that would otherwise throw a 404 (Not Found) will be given to the
//home page, which will try to decompose the route and use the correct client-side route.
app.use(function(req, res, next) {
    var fallback = 'demo/client/index.html';
    console.log('Falling back to ' + fallback + ' instead of ' + req.url);
    req.url = 'src/client/index.html';
    // next();
});

var port = process.env.PORT || 8626;
app.listen(port, function() {
    console.log('Demo server started on port ' + port);
});

var api = require('../api/api');