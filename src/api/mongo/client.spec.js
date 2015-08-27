var should = require('chai').should();
var expect = require('chai').expect;
var Client = require('./client');
var Promise = require('bluebird');

describe('Mongo Client', function()
{
  it('exists', function()
  {
    expect(Client).to.exist;
  });

  it('db is null by default', function()
  {
    expect(Client.db).to.not.exist;
  });

  it('can construct an instance', function()
  {
    expect(new Client()).to.exist;
  });

  it('can construct 2 unique instances', function()
  {
    var a = new Client();
    var b = new Client();
    expect(a).to.not.equal(b);
  });

  it('can connect if mongo db is running', function(done)
  {
    var client = new Client();
    new Promise(function(success, failure)
    {
      client.connect()
      .then(function()
      {
        success();
      });
    })
    .then(function()
    {
      client.close();
      done();
    })
    .error(function(err)
    {
      done(err);
    });
  });

  it('2 instances can connect independently', function(done)
  {
    var a = new Client();
    var b = new Client();
    Promise.all([a.connect(), b.connect()])
    .then(function()
    {
      a.close();
      b.close();
      done();
    })
    .error(function(err)
    {
      done(err);
    });
  });

  it('calling connect twice does not blow up and resolves Promise anyway', function(done)
  {
    var client = new Client();
    new Promise(function(success, failure)
    {
      client.connect();
      client.connect()
      .then(function()
      {
        client.close();
        done();
      })
      .error(function(err)
      {
        done(err);
      });
    });
  });

  it('calling connect twice inside a Promise does not blow up and resolves Promise anyway', function(done)
  {
    var client = new Client();
    new Promise(function(success, failure)
    {
      client.connect()
      .then(function()
      {
        return client.connect();
      })
      .then(function()
      {
        client.close();
        done();
      })
      .error(function(err)
      {
        done(err);
      });
    });
  });

  it('calling close without connecting blows up', function(done)
  {
    var client = new Client();
    new Promise(function(success, failure)
    {
      client.close()
      .then(function()
      {
        success();
      })
      .error(function(err)
      {
        failure(err);
      });
    })
    .then(function()
    {
      done('failed to throw error');
    })
    .error(function(err)
    {
      done();
    });
  });

});


