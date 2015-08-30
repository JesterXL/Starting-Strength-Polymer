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

  // before(function(done)
  // {
    // client = new Client();
    // client.connect()
    // .then(function()
    // {
    //   // console.log("Connected correctly to server");
    //   db = client.db;
    //   workout.db = db;
    //   done();
    // })
    // .error(function(err)
    // {
    //   done(err);
    // })
  // });

  // after(function()
  // {
    // client.close();
    // client = null;
    // // console.log("after");
    // bootstrap.deleteEverything()
    // .then(function()
    // {
    //   // console.log("after deleted");
    //   client.close();
    //    client = null;
    //   done();
    // })
    // .error(function(err)
    // {
    //   client = null;
    //   done(err);
    // });
  // });

  it('getWorkoutFromDay', function()
  {
    // var schedule = level1schedule.weekA;
    var schedule = level2schedule.weekA;

    var result = workoutCollection.getWorkoutFromDay(schedule, 'first');
    console.log("result:", result);
    true.should.be.true;
  });

  // it('getLastWorkout returns null since none exist', function(done)
  // {
  //   workout.getLastWorkout()
  //   .then(function(result)
  //   {
  //     console.log("result:", result);
  //     true.should.be.true;
  //     done();
  //   });
  // });

  // it('getTodaysWorkout returns default workout since none exist', function(done)
  // {
  //   workout.getTodaysWorkout()
  //   .then(function(result)
  //   {
  //     console.log("result:", result);
  //     true.should.be.true;
  //     done();
  //   });
  // });


});


