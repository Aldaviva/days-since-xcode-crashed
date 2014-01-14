var _            = require('lodash');
var apiServer    = require('./apiServer');
var assert       = require('assert-plus');
var crashManager = require('../services/crashManager');
var logger       = require('../common/logger')(module);

apiServer.post({ path: '/cgi-bin/crashes/:name', name: 'reportCrash' }, function(req, res, next){
	var crash = { name: req.params.name };
	
	crashManager.createCrash(crash)
		.then(function(){
			res.send(204);
		})
		.done();
});

apiServer.get({ path: '/cgi-bin/crashes/:name', name: 'getCrashesByName' }, getCrashes);
apiServer.get({ path: '/cgi-bin/crashes', name: 'getCrashes' }, getCrashes);

function getCrashes(req, res, next){
	var filter = {};

	if(req.params.name !== undefined) {
		filter.name = req.params.name;
	}

	crashManager.findCrashes({
			filter: filter,
			sort: parseSortString(req.query.sort),
			limit: _.parseInt(req.query.limit)
		})
		.then(function(crashes){
			res.send(crashes);
		})
		.done();
}

function parseSortString(sortString){
	if(sortString){
		return sortString.split(/,/g).map(function(rawSortField){
			var isAscending = (rawSortField.charAt(0) != '-');
			return [rawSortField.replace(/^[-+]/, ''), isAscending ? 1 : -1];
		});
	} else {
		return null;
	}
}