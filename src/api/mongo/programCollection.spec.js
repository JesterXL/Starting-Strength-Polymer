var should = require('chai').should();
var expect = require('chai').expect;
var programCollection = require('./programCollection');
var userCollection = require("./userCollection");
var Client = require('./client');
var Promise = require('bluebird');

describe('#programCollection', function()
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
      programCollection.db = db;
      userCollection.db = db;
      return Promise.all([programCollection.removeAll(), userCollection.removeAll()]);
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
    programCollection.removeAll()
    .then(function()
    {
      return userCollection.removeAll();
    })
    .then(function()
    {
      done();
    });
  });

  after(function(done)
  {
    programCollection.removeAll()
    .then(function()
    {
      return userCollection.removeAll();
    })
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

  it('can add a user and memento then find it', function(done)
  {
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      userSaved = user;
      return programCollection.setMonth(user, 1);
    })
    .then(function(success)
    {
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.month.should.equal(1);
      done();
    });
  });

  it('setting month twice is ok', function(done)
  {
    console.log("1. createUser");
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      console.log("2. findUser");
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      console.log("3. setMonth");
      user.should.exist;
      userSaved = user;
      return programCollection.setMonth(userSaved, 1);
    })
    .then(function(success)
    {
      console.log("4. setMonth");
      success.should.be.true;
      return programCollection.setMonth(userSaved, 2);
    })
    .then(function(success)
    {
      console.log("5. getUserMemento");
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      console.log("6. done");
      console.log("memento:", memento);
      memento.should.exist;
      memento.month.should.equal(2);
      done();
    })
    .catch(function(err)
    {
      console.log("error:", err);
      done(err);
    });
  });

  it('setting week to a', function(done)
  {
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      userSaved = user;
      return programCollection.setWeek(userSaved, 'a');
    })
    .then(function(success)
    {
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.week.should.equal('a');
      done();
    })
    .catch(function(err)
    {
      done(err);
    });
  });

  it('setting week to b', function(done)
  {
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      userSaved = user;
      return programCollection.setWeek(userSaved, 'b');
    })
    .then(function(success)
    {
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.week.should.equal('b');
      done();
    })
    .catch(function(err)
    {
      done(err);
    });
  });

  it('setting day to first', function(done)
  {
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      userSaved = user;
      return programCollection.setDay(userSaved, 'first');
    })
    .then(function(success)
    {
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.day.should.equal('first');
      done();
    })
    .catch(function(err)
    {
      done(err);
    });
  });

  it('setUserMemento works', function(done)
  {
    var userSaved = null;
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      userSaved = user;
      return programCollection.setUserMemento(userSaved, 1, 'a', 'first');
    })
    .then(function(success)
    {
      success.should.be.true;
      return programCollection.getUserMemento(userSaved);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.month.should.equal(1);
      memento.week.should.equal('a');
      memento.day.should.equal('first');
      done();
    })
    .catch(function(err)
    {
      done(err);
    });
  });

  it("creating a user gives us a default program", function(done)
  {
    userCollection.createUser("jesse@jessewarden.com", "JesterXL", "password")
    .then(function(result)
    {
      result.should.be.true;
      return userCollection.findUser({email: "jesse@jessewarden.com"});
    })
    .then(function(user)
    {
      user.should.exist;
      return programCollection.getUserMemento(user);
    })
    .then(function(memento)
    {
      memento.should.exist;
      memento.month.should.equal(1);
      memento.week.should.equal('a');
      memento.day.should.equal('first');
      done();
    })
    .catch(function(err)
    {
      done(err);
    });
  });


});


