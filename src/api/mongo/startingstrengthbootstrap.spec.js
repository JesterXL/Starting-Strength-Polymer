var should = require('chai').should();
var expect = require('chai').expect;
var bootstrap = require('./startingstrengthbootstrap');
var Client = require('../mongo/client');
var Promise = require('bluebird');

describe('Starting Strength Bootstrap', function()
{

  var client, db;

  before(function(done)
  {
    client = new Client();
    client.connect()
    .then(function()
    {
      console.log("Connected correctly to server");
      db = client.db;
      bootstrap.db = db;
      done();
    })
    .error(function(err)
    {
      done(err);
    })
  });

  after(function(done)
  {
    console.log("after");
    bootstrap.deleteEverything()
    .then(function()
    {
      console.log("after deleted");
      client.close();
       client = null;
      done();
    })
    .error(function(err)
    {
      client = null;
      done(err);
    });
  });

  it('bootstrap init is not there, but gets added', function(done)
  {
    bootstrap.initialize()
    .then(function(result)
    {
      result.should.be.true;
      done();
    });
  });

  it('bootstrap init is not there, but if added, returns true', function(done)
  {
    bootstrap.initialize()
    .then(function(result)
    {
      console.log("first");
      result.should.be.true;
      return bootstrap.initialize();
    })
    .then(function(result)
    {
      console.log("second");
      result.should.be.true;
      done();
    });
  });

});


