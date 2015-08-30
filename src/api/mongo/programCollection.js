var moment = require('moment');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var ObjectID = require('mongodb').ObjectID;
var _ = require("lodash");

var _db = null;

function validMonth(month)
{
	return _.isNumber(month) && _.includes([1, 2, 3], month);
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

var getUserMemento = async (function(user)
{
	return await (_db.collection("program").findOne({userID: user._id}));
});

var setUserMemento = async (function(user, month, week, day)
{
	if(validMonth(month) === false)
	{
		throw new Error("Invalid month");
	}
	if(validWeek(week) === false)
	{
		throw new Error("Invalid week");
	}
	if(validDay(day) === false)
	{
		throw new Error("Invalid day");
	}
	var result = await (_db.collection("program")
	.updateOne({userID: user._id}, {month: month, week: week, day: day, userID: user._id}, {upsert: true}));
	return result.result.ok === 1;
});

// month is 1, 2, or 3.
var setMonth = async (function(user, month)
{
	if(validMonth(month) === false)
	{
		throw new Error("Invalid month");
	}
	var result = await (_db.collection("program")
	.updateOne({userID: user._id}, {month: month, userID: user._id}, {upsert: true}));
	return result.result.ok === 1;
});

// week is 'a' or 'b'
var setWeek = async (function(user, week)
{
	if(validWeek(week) === false)
	{
		throw new Error("Invalid week");
	}
	var result = await (_db.collection("program")
	.updateOne({userID: user._id}, {week: week, userID: user._id}, {upsert: true}));
	return result.result.ok === 1;
});

// day is first, second, or third
var setDay = async (function(user, day)
{
	if(validDay(day) === false)
	{
		throw new Error("Invalid day");
	}
	var result = await (_db.collection("program")
	.updateOne({userID: user._id}, {day: day, userID: user._id}, {upsert: true}));
	return result.result.ok === 1;
});

var removeAll = async (function()
{
	var result = await (_db.collection("program").remove({}));
	return result.result.ok === 1;
});

module.exports = {
	hasUserMemento: hasUserMemento,
	getUserMemento: getUserMemento,
	setUserMemento: setUserMemento,
	setMonth: setMonth,
	setWeek: setWeek,
	setDay: setDay,
	removeAll: removeAll,

	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	}
};