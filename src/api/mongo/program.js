var moment = require('moment');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var ObjectID = require('mongodb').ObjectID;

var _db = null;

function validMonth(month)
{
	return _.isNumber(month) && _.includes([1, 2, 3], number);
}

function validWeek(week)
{
	return _.isString(week) && _.includes(['a', 'b'], week);
}

function validDay(day)
{
	return _.isString(day) && _.includes(['first', 'second', 'third'], day);
}

var hasUserMemento = async (function(user)
{
	var result = await (_db.collection("program")
		.findOne({userID: user._id}));
	return result.result.ok === 1;
});

// month is 1, 2, or 3.
var setMonth = async (function(user, month)
{
	if(validMonth(month) === false)
	{
		return new Error("Invalid month");
	}
	var result = await (_db.collection("program")
	.insert({userID: user._id}, {$set: {month: month}}, {upsert: true}));
	return result.result.ok === 1;
});

// week is 'a' or 'b'
var setWeek = async (function(user, week)
{
	if(validWeek(week) === false)
	{
		return new Error("Invalid week");
	}
	var result = await (_db.collection("program")
	.insert({userID: user._id}, {$set: {week: week}}, {upsert: true}));
	return result.result.ok === 1;
});

// day is first, second, or third
var setDay = async (function(user, day)
{
	if(validDay(day) === false)
	{
		return new Error("Invalid day");
	}
	var result = await (_db.collection("program")
	.insert({userID: user._id}, {$set: {day: day}}, {upsert: true}));
	return result.result.ok === 1;
});

module.exports = {

	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	}
};