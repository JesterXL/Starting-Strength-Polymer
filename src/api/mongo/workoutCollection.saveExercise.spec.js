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

describe('#workout exercises', function()
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

	var getUserFixture = async (function()
	{
		var created = await (userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password"));
		if(created === false)
		{
			throw new Error("Failed to create user fixtured.");
		}
		return await (userCollection.findUser({email: "jesse@jessewarden.com"}));
	});

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

	it("saving a workout twice updates it", async (function(done)
	{
		var savedUser = await(getUserFixture());
		var workout = await(workoutCollection.getTodaysWorkout(savedUser, new Date()));
		workout.should.exist;
		_.forEach(workout.exercises, function(exercise)
		{
			exercise.sets.push({reps: 5, weight: 45}, {reps: 5, weight: 45}, {reps: 5, weight: 45});
		});
		var saveResult = await(workoutCollection.saveWorkout(savedUser, workout));
		saveResult.result.ok.should.equal(1);
		var readWorkout = await(workoutCollection.getWorkout({_id: saveResult.insertedId}));
		readWorkout.should.exist;
		expect(readWorkout.updatedOn).to.not.exist;
		var udpateResult = await(workoutCollection.saveWorkout(savedUser, workout));
		udpateResult.should.exist;
		var updatedWorkout = await(workoutCollection.getWorkout({_id: saveResult.insertedId}));
		updatedWorkout.updatedOn.should.exist;
		done();
	}));

	describe('#getWorkoutsWithinDateRange', function()
	{
		var saveAWorkoutFixture = async(function(user, createdDate)
		{
			var programFixture = {
				"level" : 1,
				"week" : "a",
				"day" : "first",
				"userID" : user._id
			};
			var workout = await(workoutCollection.getWorkoutFromProgram(programFixture));
			workout.should.exist;
			_.forEach(workout.exercises, function(exercise)
			{
				exercise.sets.push({reps: 5, weight: 45}, {reps: 5, weight: 45}, {reps: 5, weight: 45});
			});
			var saveResult = await(workoutCollection.saveWorkout(user, workout, createdDate));
			saveResult.result.ok.should.equal(1);
			var readWorkout = await(workoutCollection.getWorkout({_id: saveResult.insertedId}));
			readWorkout.should.exist;
			return readWorkout;
		});

		it('by default finds nothing', async(function(done)
		{
			var yesterday = getDate(-1);
			var tomorrow = getDate(1);
			var savedUser = await(getUserFixture());
			var workouts = await(workoutCollection.getWorkoutsWithinDateRange(savedUser, yesterday, tomorrow));
			console.log("workouts:", workouts);
			workouts.should.be.empty;
			done();
		}));

		var getDate = function(days)
		{
			if(_.isNumber(days) === false || _.isNaN(days))
			{
				days = 0;
			}
			var aDate = new Date();
			aDate.setDate(aDate.getDate() + days);
			return aDate;
		};

		it('finds 3 workouts of 3 if dates are correct', async(function(done)
		{
			var twoDaysAgo = getDate(-2);
			var threeDaysFromNow = getDate(2);
			var today = getDate();
			var lastWeek = getDate(-7);
			var nextWeek = getDate(7);
			var savedUser = await(getUserFixture());
			var result1 = await(saveAWorkoutFixture(savedUser, twoDaysAgo));
			var result2 = await(saveAWorkoutFixture(savedUser, threeDaysFromNow));
			var result3 = await(saveAWorkoutFixture(savedUser, today));
			var workouts = await(workoutCollection.getWorkoutsWithinDateRange(savedUser, lastWeek, nextWeek));
			workouts.should.have.length(3);
			done();
		}));

		it('3 days of workouts finds the 1 in the middle', async(function(done)
		{
			var twoDaysAgo = getDate(-2);
			var threeDaysFromNow = getDate(2);
			var today = getDate();
			var savedUser = await(getUserFixture());
			var result1 = await(saveAWorkoutFixture(savedUser, twoDaysAgo));
			var result2 = await(saveAWorkoutFixture(savedUser, threeDaysFromNow));
			var result3 = await(saveAWorkoutFixture(savedUser, today));
			var workouts = await(workoutCollection.getWorkoutsWithinDateRange(savedUser, twoDaysAgo, threeDaysFromNow));
			workouts.should.have.length(1);
			done();
		}));

		it('trying to save 2 different workouts in 1 day fails', async(function(done)
		{
			var twoDaysAgo = getDate(-2);
			var threeDaysFromNow = getDate(2);
			var today = getDate();
			var savedUser = await(getUserFixture());
			var result1 = await(saveAWorkoutFixture(savedUser, twoDaysAgo));
			var result2 = await(saveAWorkoutFixture(savedUser, threeDaysFromNow));
			var result3 = await(saveAWorkoutFixture(savedUser, today));
			saveAWorkoutFixture(savedUser, today)
			.then(function(success)
			{
				done(new Error("Should not allow a double save."));
			})
			.catch(function(error)
			{
				done();
			});
		}));


	});
});