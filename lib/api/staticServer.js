var apiServer      = require('./apiServer');
var lessMiddleware = require('less-middleware');
var restify        = require('restify');

var publicDir = 'public';

apiServer.use(lessMiddleware({
	src: publicDir,
	force: true, //TODO after styling is pretty stable
	debug: false
}));

apiServer.get(/\//, restify.serveStatic({
	directory: publicDir,
	maxAge: 3600,
	default: 'index.html'
}));