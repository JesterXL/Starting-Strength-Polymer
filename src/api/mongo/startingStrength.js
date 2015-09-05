var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var bootstrap = require('./startingstrengthbootstrap');
var programCollection = require('./programCollection');
var userCollection = require('./userCollection');
var workoutCollection = require('./workoutCollection');

var _db = null;

module.exports = {
	get db()
	{
		return _db;
	},
	set db(newDB)
	{
		_db                  = newDB;
		bootstrap.db         = newDB;
		programCollection.db = newDB;
		userCollection.db    = newDB;
		workoutCollection.db = newDB;
	},
	bootstrap: bootstrap,
	userCollection: userCollection,
	programCollection: programCollection,
	workoutCollection: workoutCollection
};