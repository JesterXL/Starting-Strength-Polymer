var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var defaultWorkout = require('./fixtures/defaultworkout');

var _db = null;

function isValidDate(date)
{
	return _.isDate(date) && date.toString().toLowerCase() !== 'invalid date';
}

function getNextWorkoutDay(day)
{
	day += 2;
	if(day > 6)
	{
		return day -= 6;
	}
	return day;
}

var getThirdWorkoutDay = _.flow(getNextWorkoutDay, getNextWorkoutDay);

function getWorkoutDays(day)
{
	return [day, getNextWorkoutDay(day), getThirdWorkoutDay(day)];
}

var getTodaysWorkout = async (function(date)
{
	if(isValidDate(date) === false)
	{
		date = new Date();
	}
	var lastWorkout = await (getLastWorkout(date));
	if(lastWorkout === null)
	{
		// make sure it starts today
		var todaysWorkout = _.cloneDeep(defaultWorkout);
		todaysWorkout.days = getWorkoutDays(date.getDay());
		return todaysWorkout;
	}
	else
	{
		// what month are you on?
		// what week are you on?
		// what day is it?
		
	}
});

var getLastWorkout = async (function(userID, date)
{
	if(isValidDate(date) === false)
	{
		date = new Date();
	}
	var workout = await (_db.collection("workout")
	.findOne({userID: userID, created_on: {$lt: date}}));
	return workout;
});

var workout = {
	getTodaysWorkout: getTodaysWorkout,
	getLastWorkout: getLastWorkout,
	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	}
};

module.exports = workout;