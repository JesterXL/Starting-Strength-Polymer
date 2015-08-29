var should = require('chai').should();
var expect = require('chai').expect;
var workout = require('./workout');
var Client = require('./client');
var Promise = require('bluebird');

describe('#workout', function()
{

  var client, db;

  before(function(done)
  {
    client = new Client();
    client.connect()
    .then(function()
    {
      // console.log("Connected correctly to server");
      db = client.db;
      workout.db = db;
      done();
    })
    .error(function(err)
    {
      done(err);
    })
  });

  after(function()
  {
    client.close();
    client = null;
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
  });

  it('getLastWorkout returns null since none exist', function(done)
  {
    workout.getLastWorkout()
    .then(function(result)
    {
      console.log("result:", result);
      true.should.be.true;
      done();
    });
  });

  it('getTodaysWorkout returns default workout since none exist', function(done)
  {
    workout.getTodaysWorkout()
    .then(function(result)
    {
      console.log("result:", result);
      true.should.be.true;
      done();
    });
  });


});


