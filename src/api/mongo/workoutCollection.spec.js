var should = require('chai').should();
var expect = require('chai').expect;
require('chai').use(require('chai-things'));
var workoutCollection = require('./workoutCollection');
var programCollection = require('./programCollection');
var userCollection = require('./userCollection');
var Client = require('./client');
var Promise = require('bluebird');
var level1schedule = require("./fixtures/level1schedule");
var level2schedule = require("./fixtures/level2schedule");
var level3schedule = require("./fixtures/level3schedule");
var _ = require("lodash");
var async = require('asyncawait/async');
var await = require('asyncawait/await');


describe('#workout', function()
{

	var client, db;
	var lastWorkout = {
		program: {
			day: 'first',
			week: 'a',
			level: 2,
		},
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

	var client, db;

	before(function(done)
	{
		client = new Client();
		client.connect()
		.then(function()
		{
			db = client.db;
			workoutCollection.db = db;
			programCollection.db = db;
			userCollection.db = db;
			return Promise.all([programCollection.removeAll(), 
				workoutCollection.removeAll(), 
				userCollection.removeAll()]);
		})
		.then(function()
		{
			done();
		})
		.error(function(err)
		{
			done(err);
		})
	});

	afterEach(function(done)
	{
		Promise.all([programCollection.removeAll(), 
			workoutCollection.removeAll(), 
			userCollection.removeAll()])
		.then(function()
		{
			done();
		});
	});

	after(function(done)
	{
		Promise.all([programCollection.removeAll(), 
			workoutCollection.removeAll(), 
			userCollection.removeAll()])
		.then(function()
		{
			return client.close();
		})
		.then(function()
		{
			client = null;
			done();
		})
		.error(function(err)
		{
			client = null;
			done(err);
		});
	});

	var getUserFixture = async (function()
	{
		var created = await (userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password"));
		if(created === false)
		{
			throw new Error("Failed to create user fixtured.");
		}
		return await (userCollection.findUser({email: "jesse@jessewarden.com"}));
	});

	describe('#getWorkoutFromDay', function()
	{
		it('works for level 1 first', function()
		{
			var result = workoutCollection.getWorkoutFromDay(level1schedule.weekA, 'first');
			result.should.exist;
			result.days.should.include('first');
			result.exercises.should.include({ name: 'Squat', sets: 3, reps: 5 });
		});

		it('works for level 1 second', function()
		{
			var result = workoutCollection.getWorkoutFromDay(level1schedule.weekA, 'second');
			result.should.exist;
			result.days.should.include('second');
			result.exercises.should.include({ name: 'Squat', sets: 3, reps: 5 });
		});

		it('works for level 2', function()
		{
			var result = workoutCollection.getWorkoutFromDay(level2schedule.weekA, 'first');
			result.should.exist;
			result.days.should.include('first');
			result.exercises.should.include({ name: 'Squat', sets: 3, reps: 5 });
		});
	});

	describe('#getWorkoutFromProgram', function()
	{
		var programFixture = {
			level: 1,
			week: 'a',
			day: 'first'
		};

		it('gets a basic workout from a basic program', function()
		{
			var workout = workoutCollection.getWorkoutFromProgram(programFixture);
      // console.log("workout:", workout);
      workout.should.exist;
      workout.days.should.include('first');
      workout.exercises.should.contain.a.thing.with.property('name', 'Squat');
  });
	});

	describe("#getWorkoutBasedOnLastWorkout", function()
	{
		var lastWorkout = null;

		beforeEach(function()
		{
			lastWorkout = _.cloneDeep({
				program: {
					day: 'first',
					week: 'a',
					level: 2
				},
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
				},
				{
					name: 'Overhead Press',
					goalSets: 3,
					goalReps: 5,
					sets: [
					{reps: 5, weight: 45},
					{reps: 5, weight: 45},
					{reps: 5, weight: 45}
					]
				}
				]
			});
		});

		it("gets a workout based on a fixture", function()
		{
			var workout = workoutCollection.getWorkoutBasedOnLastWorkout(lastWorkout);
			workout.should.exist;
			workout.days.should.include('second');
			workout.exercises.should.contain.a.thing.with.property('name', 'Squat');
		});

		it("gets first day based on last day", function()
		{
			lastWorkout.program.day = 'third';
			var workout = workoutCollection.getWorkoutBasedOnLastWorkout(lastWorkout);
			workout.should.exist;
			workout.days.should.include('first');
			workout.exercises.should.contain.a.thing.with.property('name', 'Squat');
		});

		it("gets third day based on second day", function()
		{
			lastWorkout.program.day = 'second';
			var workout = workoutCollection.getWorkoutBasedOnLastWorkout(lastWorkout);
			workout.should.exist;
			workout.days.should.include('third');
			workout.exercises.should.contain.a.thing.with.property('name', 'Squat');
		});

		it("gets week b based on finishing a", function()
		{
			lastWorkout.program.day = 'third';
			lastWorkout.exercises[1].name.should.equal('Overhead Press');
			var workout = workoutCollection.getWorkoutBasedOnLastWorkout(lastWorkout);
			workout.should.exist;
			workout.days.should.include('first');
			workout.exercises[1].name.should.equal('Bench Press');
			workout.exercises.should.contain.a.thing.with.property('name', 'Bench Press');
		});

	});

describe("#getTodaysWorkout", function()
{
	it("gets a default workout for a new user", function(done)
	{
		getUserFixture().then(function(user)
		{
			return workoutCollection.getTodaysWorkout(user, new Date());
		})
		.then(function(workout)
		{
        // console.log("workout:", workout);
        workout.should.exist;
        done();
    });
	});
});

describe("#saveWorkout", function()
{
	it("works", function(done)
	{
		var savedUser = null;
		getUserFixture().then(function(user)
		{
			savedUser = user;
			return workoutCollection.getTodaysWorkout(user, new Date());
		})
		.then(function(workout)
		{
        workout.should.exist;
        _.forEach(workout.exercises, function(exercise)
        {
        	exercise.sets.push({reps: 5, weight: 45}, {reps: 5, weight: 45}, {reps: 5, weight: 45});
        });
        return workoutCollection.saveWorkout(savedUser, workout);
    })
		.then(function(result)
		{
			result.result.ok.should.equal(1);
			done();
		})
		.catch(function(error)
		{
			console.error("saveWorkout error:", error);
		});
	});

	it("saves it then you can read it out", function(done)
	{
		var savedUser = null;
		var now = new Date();
		getUserFixture().then(function(user)
		{
			savedUser = user;
			return workoutCollection.getTodaysWorkout(user, new Date());
		})
		.then(function(workout)
		{
			workout.should.exist;
			_.forEach(workout.exercises, function(exercise)
			{
				exercise.sets.push({reps: 5, weight: 45}, {reps: 5, weight: 45}, {reps: 5, weight: 45});
			});
			return workoutCollection.saveWorkout(savedUser, workout);
		})
		.then(function(result)
		{
			result.result.ok.should.equal(1);
			return workoutCollection.getWorkout({userID: savedUser._id});
		})
		.then(function(readWorkout)
		{
			readWorkout.should.exist;
			done();
		})
		.catch(function(error)
		{
			console.error("saveWorkout error:", error);
		});
	});

});




});


