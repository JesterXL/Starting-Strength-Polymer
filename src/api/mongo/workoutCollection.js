var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var userCollection = require('./userCollection');
var programCollection = require('./programCollection');
var level1schedule = require("./fixtures/level1schedule");
var level2schedule = require("./fixtures/level2schedule");
var level3schedule = require("./fixtures/level3schedule");

var _db = null;

function isValidDate(date)
{
	return _.isDate(date) && date.toString().toLowerCase() !== 'invalid date';
}

function getWorkoutFromProgram(program)
{
	var schedule = getScheduleFromLevel(program.level);
	var workouts = getWorkoutsFromScheduleWeek(schedule, program.week);
	return getWorkoutFromDay(workouts);
}

function getScheduleFromLevel(level)
{
	if(programCollection.validLevel(level))
	{
		switch(level)
		{
			case 1: return level1schedule;
			case 2: return level2schedule;
			case 3: return level3schedule;
		}
	}
	else
	{
		return require("./fixtures/level1schedule");
	}
}

function getWorkoutsFromScheduleWeek(schedule, week)
{
	if(programCollection.validWeek(week) === false)
	{
		week = 'a';
	}
	switch(schedule.name)
	{
		case "level1": return level1schedule.weekA;
		case "level2":
			if(week === 'a')
			{
				return level2schedule.weekA;
			}
			else
			{
				return level2schedule.weekB;
			}
		case "level3":
			if(week === 'a')
			{
				return level3schedule.weekA;
			}
			else
			{
				return level3schedule.weekB;
			}
	}
}

function getWorkoutFromDay(workouts, day)
{
	if(programCollection.validDay(day) === false)
	{
		day = 'first';
	}
	var match = null;
	var counter = 0;
	_.forEach(workouts, function(workout)
	{
		if(_.includes(workout.days, day))
		{
			counter++;
			if(counter > 1)
			{
				throw new Error("Too many matches.");
			}
			match = workout;
		}
	});
	return match;
}

function getNextDay(day)
{
	if(day === 'first')
	{
		return 'second';
	}
	else if(day === 'second')
	{
		return 'third';
	}
	else if(day === 'third')
	{
		return 'first';
	}
}

function startingNewWeek(day)
{
	return day === 'first';
}

function getNextWeek(level, week)
{
	if(level === 1)
	{
		return 'a';
	}
	else if(level === 2 || level === 3)
	{
		if(week === 'a')
		{
			return 'b';
		}
		else
		{
			return 'a';
		}
	}
	else
	{
		throw new Error("Unknown level: " + level);
	}
}

function getWorkoutBasedOnLastWorkout(lastWorkout)
{
	// next workout for day
	// ready to move week?
	// ready to move level?
	var exampleLastWorkout = {
		day: 'first',
		week: 'a',
		level: 2,
		notes: "Some notes about it.",
		createdOn: new Date(),
		exercises: [
			{
                name: 'Squat',
                goalSets: 3,
                goalReps: 5,
                sets: [
                	{reps: 5, weight: 45},
                	{reps: 5, weight: 45},
                	{reps: 5, weight: 45}
                ]

            }
		]
	};

	var day = getNextDay(lastWorkout.day);
	var isStartingNewWeek = startingNewWeek(day);
	var week = lastWorkout.week;
	if(isStartingNewWeek)
	{
		week = getNextWeek(lastWorkout.level, lastWorkout.week);
	}
	// TODO: intelligently predict next level
	var level = lastWorkout.level;
	var schedule = getScheduleFromLevel(level);
	var workouts = getWorkoutsFromScheduleWeek(schedule, week);
	var workout = getWorkoutFromDay(workouts, day);

	// TODO: adjust goals
	return workout;
}



var getTodaysWorkout = async (function(user, date)
{
	if(isValidDate(date) === false)
	{
		throw new Error("date is invalid");
	}

	var lastWorkout = await (getLastWorkout(user, date));
	if(lastWorkout === null)
	{
		// they don't have one, so check their program, and make one
		var program = await (programCollection.getUserMemento(user));
		return getWorkoutFromProgram(program);
	}
	else
	{
		return getWorkoutBasedOnLastWorkout(lastWorkout);
	}
});

var getLastWorkout = async (function(userID, date)
{
	if(isValidDate(date) === false)
	{
		throw new Error("date is invalid");
	}
	var workout = await (_db.collection("workout")
	.findOne({userID: userID, createdOn: {$lt: date}}));
	return workout;
});

var removeAll = async (function()
{
	var result = await (_db.collection("workout").remove({}));
	return result.result.ok === 1;
});

var workout = {

	removeAll: removeAll,
	getWorkoutFromProgram: getWorkoutFromProgram,
	getWorkoutFromDay: getWorkoutFromDay,
	getTodaysWorkout: getTodaysWorkout,
	getWorkoutBasedOnLastWorkout: getWorkoutBasedOnLastWorkout,

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