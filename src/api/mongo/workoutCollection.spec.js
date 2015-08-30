var should = require('chai').should();
var expect = require('chai').expect;
var workoutCollection = require('./workoutCollection');
var Client = require('./client');
var Promise = require('bluebird');
var level1schedule = require("./fixtures/level1schedule");
var level2schedule = require("./fixtures/level2schedule");
var level3schedule = require("./fixtures/level3schedule");

describe('#workout', function()
{

  var client, db;
  var lastWorkout = {
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

  var client, db;

  before(function(done)
  {
    client = new Client();
    client.connect()
    .then(function()
    {
      db = client.db;
      workoutCollection.db = db;
      return workoutCollection.removeAll();
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
    workoutCollection.removeAll()
    .then(function()
    {
      done();
    });
  });

  after(function(done)
  {
    workoutCollection.removeAll()
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
  



});


