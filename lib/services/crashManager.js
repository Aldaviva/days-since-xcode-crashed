var assert = require('assert-plus');
var db     = require('../data/db');
var Q      = require('q');
var logger = require('../common/logger')(module);
var _      = require('lodash');

var crashesCollection = db.collection('crashes');

var DEFAULT_SORT = [["date", -1]];

module.exports.createCrash = function(crash){
	var sanitizedCrash = _.omit(crash, "id", "_id", "date");
	assert.string(sanitizedCrash.name, "name is required: try POST /cgi-bin/crashes/xcode");
	sanitizedCrash.date = +new Date();

	logger.debug({ crash: sanitizedCrash }, "creating crash");

	return Q.ninvoke(crashesCollection, "insert", sanitizedCrash);
};

module.exports.findCrashes = function(opts){
	assert.optionalNumber(opts.limit);
	assert.optionalObject(opts.filter);

	var filter = opts.filter || {};
	var sort = opts.sort || DEFAULT_SORT;
	var limit = opts.limit || 0;

	return Q.ninvoke(crashesCollection, "find", filter, { limit: limit, sort: sort })
		.then(function(cursor){
			return Q.ninvoke(cursor, "toArray");
		});
};