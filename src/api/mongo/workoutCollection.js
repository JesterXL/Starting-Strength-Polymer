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
			setsAreValid(exercise.sets)
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
	console.log("isValidWorkout, workout:", workout);
	var endResult = _.every([
		_.isObject,
		validWorkoutDay,
		validWorkoutWeek,
		validWorkoutLevel,
		validWorkoutNotes,
		validWorkoutExercises,
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
	console.log("isValidWorkout endResult:", endResult);
	return endResult;
}

var getTodaysWorkout = async (function(user, date)
{
	if(validDate(date) === false)
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
	if(validDate(date) === false)
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

var saveWorkout = async (function(user, workout)
{
	if(isValidWorkout(workout) === false)
	{
		throw new Error("Workout is invalid");
	}

	if(_.isString(workout._id) === false)
	{
		workout.userID = ObjectID(user._id);
		var updateResult = await (_db.collection("workout")
		.insertOne(workout));
		return updateResult.result.ok === 1;
	}
	else
	{
		if(validDate(workout.createdOn) === false)
		{
			throw new Error("Existing workout is missing a createdOn Date property.");
		}
		var result = await (_db.collection("workout")
		.updateOne({_id: workout._id}, workout, {upsert: false}));
		return result.result.ok === 1;
	}
});

var workout = {

	removeAll: removeAll,
	getWorkoutFromProgram: getWorkoutFromProgram,
	getWorkoutFromDay: getWorkoutFromDay,
	getTodaysWorkout: getTodaysWorkout,
	getWorkoutBasedOnLastWorkout: getWorkoutBasedOnLastWorkout,
	saveWorkout: saveWorkout,

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