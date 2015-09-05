var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var userCollection = require('./userCollection');
var programCollection = require('./programCollection');
var workoutCollection = require('./workoutCollection');

var _db = null;

var programInitIsThere = async (function()
{
	// console.log("programInitIsThere");
	var result = await (_db.collection("programinit")
	.find({initialized: true})
	.toArray());

	if(result.length > 0)
	{
		// console.log("found an init document");
		return true;
	}
	else
	{
		// console.log("no init document exists");
		return false;
	}
});

var insertInitialization = async (function()
{
	console.log("insertInitialization");
	var result = await (_db.collection("programinit")
	.insert({initialized: true}));
	if(result.result.ok === 1)
	{
		console.log("inserted init document");
		var defaultResult = await (insertDefaultSchedules());
		var userResult = await (insertDefaultUsers());
		if(defaultResult === true)
		{
			return true;
		}
		else
		{
			return new Error("Insert of default schedules result was not ok: " + result.result);
		}
	}
	else
	{
		// console.log("failed to insert init document");
		return new Error("Result was not ok: " + result.result);
	}
});

var deleteEverything = async (function()
{
	// console.log("deleteEverything");
	var result = await (_db.collection("programinit")
	.remove({}));

	if(result.result.ok === 1)
	{
		console.log("removeing all in schedule...");
		var deleteScheduleResult = await (_db.collection('schedule')
		.remove({}));
		if(result.result.ok === 1)
		{
			return true;
		}
		else
		{
			return new Error("Result2 was no ok: " + result.result);
		}
	}
	else
	{
		return new Error("Result1 was not ok: " + result.result);
	}

	var removedPrograms = await (programCollection.removeAll());
	var removedWorkouts = await (workoutCollection.removeAll());
	var removedUsers = await (userCollection.removeAll());
	return _.every([removedPrograms, removedWorkouts, removedUsers]);
});

var initialize = async (function()
{
	console.log("initialize");
	var isThere = await (programInitIsThere());
	if(isThere === true)
	{
		return true;
	}
	else
	{
		var injected = await (insertInitialization());
		if(injected === true)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
});

var insertDefaultSchedules = async (function()
{
	console.log("insertDefaultSchedules");
	var level1schedule = require('./fixtures/level1schedule');
	var level2schedule = require('./fixtures/level2schedule');
	var level3schedule = require('./fixtures/level3schedule');

	var result = await(_db.collection("schedule").insertMany([level1schedule, level2schedule, level3schedule]));
	if(result.result.ok === 1)
	{
		return true;
	}
	else
	{
		return new Error("Result was not ok: " + result.result);
	}
});

var insertDefaultUsers = async (function()
{
	console.log("insertDefaultUsers");

	var result = await(userCollection.createUser('jesse@jessewarden.com', 'jesse', 'test'));
	if(result.result.ok === 1)
	{
		return true;
	}
	else
	{
		return new Error("Result was not ok: " + result.result);
	}
});

var startingStrengthBootstrap = {
	initialize: initialize,
	deleteEverything: deleteEverything,
	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	}
};

module.exports = startingStrengthBootstrap;