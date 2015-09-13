var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var _ = require('lodash');
var ObjectID = require('mongodb').ObjectID;
var ISODate = require('mongodb').ISODate;
var userCollection = require('./userCollection');
var programCollection = require('./programCollection');
var level1schedule = require("./fixtures/level1schedule");
var level2schedule = require("./fixtures/level2schedule");
var level3schedule = require("./fixtures/level3schedule");
var fixID = require("./mongoUtils").fixID;
// var moment = require('moment');

var _db = null;

function validDate(date)
{
	return _.isDate(date) && date.toString().toLowerCase() !== 'invalid date';
}

function getWorkoutFromProgram(program)
{
	var schedule = getScheduleFromLevel(program.level);
	var workouts = getWorkoutsFromScheduleWeek(schedule, program.week);
	var workout = _.cloneDeep(getWorkoutFromDay(workouts));
	workout.program = program;
	_.forEach(workout.exercises, function(exercise)
	{
		exercise.goalSets = exercise.sets;
		exercise.goalReps = exercise.reps;
		delete exercise.reps;
		exercise.sets = [];
	});
	return workout;
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
	if(_.isObject(match) === false)
	{
		throw new Error("Couldn't find a match.");
	}

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
	var workout = _.cloneDeep(getWorkoutFromDay(workouts, day));

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

	// TODO: adjust goals
	workout.day = day;
	workout.week = week;
	workout.level = level;
	// _.forEach(match.exercises, function(exercise)
	// {
	// });

	
	return workout;
}

function validWorkoutNotes(workout)
{
	if(_.isNull(workout.notes) || _.isUndefined(workout.notes))
	{
		return true;
	}
	if(_.isString(workout.notes))
	{
		return true;
	}
	return false;
}

function exerciseNotesAreValid(exercise)
{
	if(_.isNull(exercise.notes) || _.isUndefined(exercise.notes))
	{
		return true;
	}
	if(_.isString(exercise.notes))
	{
		return true;
	}
	return false;
}

function exercisesAreValid(exercises)
{
	if(_.isArray(exercises) === false)
	{
		return false;
	}

	return _.every(exercises, exerciseIsValid);
}

function exerciseIsValid(exercise)
{
	if(_.isObject(exercise) === false)
	{
		return false;
	}
	return _.every([
			_.isString(exercise.name),
			_.isArray(exercise.sets),
			setsAreValid(exercise.sets),
			exerciseNotesAreValid
		]);
}

function setsAreValid(sets)
{
	return _.every(sets, setIsValid);
}

function setIsValid(set)
{
	return _.every([
			_.isObject(set),
			_.isNumber(set.reps),
			_.isNumber(set.weight),
			_.isNaN(set.reps) === false,
			_.isNaN(set.weight) === false
		]);
}

function validWorkoutDay(workout)
{
	return programCollection.validDay(workout.program.day);
}

function validWorkoutWeek(workout)
{
	return programCollection.validWeek(workout.program.week);
}

function validWorkoutLevel(workout)
{
	return programCollection.validLevel(workout.program.level);
}

function validWorkoutDate(workout)
{
	return validDate(workout.createdOn);
}

function validWorkoutExercises(workout)
{
	return exercisesAreValid(workout.exercises);
}

function isValidWorkout(workout)
{
	// console.log("isValidWorkout, workout:", workout);
	var endResult = _.every([
		_.isObject,
		validWorkoutDay,
		validWorkoutWeek,
		validWorkoutLevel,
		validWorkoutNotes,
		validWorkoutExercises
		], function(predicate)
		{
			var result = predicate(workout);
			if(result === false)
			{
				console.warn("isValidWorkout predicate failed, predicate:", predicate);
			}
			return result;
		});
	// console.log("isValidWorkout endResult:", endResult);
	return endResult;
}

var getWorkout = async (function(workoutQuery)
{
	return await (_db.collection("workout").findOne(workoutQuery));
});

var getTodaysWorkout = async (function(user, date)
{
	if(validDate(date) === false)
	{
		throw new Error("date is invalid");
	}

	// do we have a saved workout for today?
	var yesterday = new Date(date.valueOf());
	yesterday.setDate(yesterday.getDate() - 1);
	var tomorrow = new Date(date.valueOf());
	tomorrow.setDate(tomorrow.getDate() + 1);
	console.log("Looking for existing workouts today...");
	var workouts = await(getWorkoutsWithinDateRange(user, yesterday, tomorrow));
	if(workouts.length > 0)
	{
		console.log("Found one!");
		return workouts[0];
	}

	console.log("None found, looking for yesterdays to make you a new one.");

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
	if(validDate(date) === false)
	{
		throw new Error("date is invalid");
	}
	var workout = await (_db.collection("workout")
	.findOne({userID: userID, createdOn: {$lt: date}}));
	return workout;
});

var getWorkoutsWithinDateRange = async (function(user, startDate, endDate)
{
	if(_.every([startDate, endDate], validDate) === false)
	{
		throw new Error("start or end date is invalid");
	}
	console.log("startDate:", startDate);
	console.log("endDate:", endDate);
	// NOTE: I cannot get Mongo's date query to work, so I try it, and if it fails,
	// I fall back to Moment
	var results = await (_db.collection("workout")
	.find({userID: user._id.str, createdOn: {$gt: startDate, $lt: endDate}}).toArray());
	// if(results.length < 1)
	// {
	// 	console.log("None found, falling back to using moment...");
	// 	var weekPrior = new Date(startDate.valueOf());
	// 	weekPrior.setDate(weekPrior.getDate() - 7);
	// 	var nextWeek = new Date(endDate.valueOf());
	// 	nextWeek.setDate(nextWeek.getDate() + 7);
	// 	var allResults = await (_db.collection("workout")
	// 		.find({userID: user._id.str}).toArray());
	// 	results = _.filter(allResults, function(workout)
	// 	{
	// 		return moment(workout.createdOn).isBetween(startDate, endDate);
	// 	});
	// 	console.log("moment found " + results.length + " results.");
	// 	return results;
	// }
	// else
	// {
	// 	console.log("found " + results.length + " results.");
	// 	return results;
	// }
});

var removeAll = async (function()
{
	var result = await (_db.collection("workout").remove({}));
	return result.result.ok === 1;
});

var saveWorkout = async (function(user, workout, createDate)
{
	if(isValidWorkout(workout) === false)
	{
		throw new Error("Workout is invalid");
	}

	if(_.isDate(createDate) === false)
	{
		createDate = new Date();
	}

	if(_.isObject(workout._id) === false && _.isString(workout._id) === false)
	{
		// before we allow people to save a new workout, we must
		// ensure one doesn't already exist; we can't allow 2 workouts on the 
		// same day, regardless if new or not. If someone does manage to have 2 workouts
		// like this somehow, we have a data issue elsewhere that needs to be fixed.
		
		// verify no workouts occur on this day for this user with this program
		console.log("Checking for any workouts between yesterday and tomorrow...");
		var now = new Date(createDate.valueOf());
		var yesterday = new Date(now.valueOf());
		yesterday.setDate(yesterday.getDate() - 1);
		var tomorrow = new Date(now.valueOf());
		tomorrow.setDate(tomorrow.getDate() + 1);
		var workouts = await(getWorkoutsWithinDateRange(user, yesterday, tomorrow));
		if(workouts.length > 0)
		{
			// TODO: verify this is by program in the future
			throw new Error("Only 1 workout can be saved per day.");
		}

		console.log("None found, creating new workout...");
		workout.userID = ObjectID(user._id);
		workout.createdOn = createDate;
		return await (_db.collection("workout")
		.insertOne(workout));
	}
	else
	{
		if(_.isString(workout._id) === true)
		{
			console.log("workout._id is a String, converting to ObjectID.");
			workout._id = ObjectID(workout._id);
		}
		workout._id = fixID(workout._id);
		console.log("_id found, checking createdOn date...");
		if(validDate(workout.createdOn) === false)
		{
			console.warn("Existing workout is missing a createdOn Date property.");
			workout.createdOn = createDate;
		}
		workout.updatedOn = new Date();
		var originalWorkout = await(getWorkout({_id: workout._id}));
		console.log("originalWorkout we're updating is:", originalWorkout);
		console.log("Updating existing workout with _id:", workout._id);
		return await (_db.collection("workout")
		.updateOne({_id: workout._id}, workout, {upsert: false}));
	}
});



var workout = {

	removeAll: removeAll,
	getWorkoutFromProgram: getWorkoutFromProgram,
	getWorkoutFromDay: getWorkoutFromDay,
	getTodaysWorkout: getTodaysWorkout,
	getWorkoutBasedOnLastWorkout: getWorkoutBasedOnLastWorkout,
	saveWorkout: saveWorkout,
	getWorkout: getWorkout,
	getWorkoutsWithinDateRange: getWorkoutsWithinDateRange,

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