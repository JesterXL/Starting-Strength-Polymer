var should = require('chai').should();
var expect = require('chai').expect;
var userCollection = require('./userCollection');
var Client = require('../mongo/client');
var Promise = require('bluebird');

describe('UserCollection API', function()
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
      userCollection.db = db;
      return userCollection.removeAll();
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

  after(function(done)
  {
    userCollection.removeAll()
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

  beforeEach(function(done)
  {
    userCollection.removeAll()
    .then(function()
    {
      done();
    })
    .error(function(err)
    {
      done(err);
    });
  });

  it('userCollection is there', function()
  {
    expect(userCollection).to.exist;
  });

  it('userCollection has a db instance', function()
  {
    expect(userCollection.db).to.exist;
  });

  it("a Promise works", function(done)
  {
    new Promise(function(success, fail)
    {
      setTimeout(success, 100);
    })
    .then(function()
    {
      expect(true).to.be.true;
      done();
    });
  });

  it('userCollection can add a user', function(done)
  {
      userCollection.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        done();
      });
  });

  it('userCollection can add a user and then find it', function(done)
  {
      userCollection.insertUser({firstName: "Jesse", lastName: "Warden"})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return userCollection.findUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(1);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('userCollection can add a user, then update their name', function(done)
  {
    userCollection.insertUser({firstName: 'Jesse', lastName: 'Warden'})
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return userCollection.findUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      return userCollection.updateUser({firstName: 'Jesse'}, {firstName: 'Bruce'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return userCollection.findUser({firstName: 'Bruce'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      expect(result[0].firstName).to.equal('Bruce');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('userCollection can add a user, then update its firstName with multiple items in there', function(done)
  {
    userCollection.insertUser({firstName: 'Jesse'})
    .then(function(result)
    {
      return userCollection.insertUser({firstName: 'Clark'});
    })
    .then(function(result)
    {
      return userCollection.insertUser({firstName: 'Oliver'});
    })
    .then(function(result)
    {
      return userCollection.findUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      return userCollection.updateUser({firstName: 'Jesse'}, {firstName: 'Grundy'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
       return userCollection.findUser({firstName: 'Grundy'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      expect(result[0].firstName).to.equal('Grundy');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('userCollection can add a user, then update its name with multiple items of the same name in there', function(done)
  {
    userCollection.insertUser({firstName: 'Jesse'})
    .then(function(result)
    {
      return userCollection.insertUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      return userCollection.insertUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      return userCollection.findUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(3);
      return userCollection.updateUser({firstName: 'Jesse'}, {firstName: 'Grundy'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return userCollection.findUser({firstName: 'Grundy'});
    })
    .then(function(result)
    {
      expect(result[0].firstName).to.equal('Grundy');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('userCollection can add a user and then cannot find it', function(done)
  {
      userCollection.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return userCollection.findUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(1);
        return userCollection.removeUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return userCollection.findUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(0);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('userCollection can add a user and then cannot find it if you use wrong filter', function(done)
  {
      userCollection.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return userCollection.findUser({firstName: 'cow'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(0);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('adding 3 users results in finding 3 users for getAllUsers via Promise', function(done)
  {
      userCollection.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        return userCollection.insertUser({firstName: 'Oliver'});
      })
      .then(function(result)
      {
        return userCollection.insertUser({firstName: 'Bruce'});
      })
      .then(function(result)
      {
        return userCollection.getAllUsers();
      })
      .then(function(result)
      {
        expect(result.length).to.equal(3);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('adding 3 users results in finding 3 users for getAllUsers', function(done)
  {
      userCollection.insertUser([{firstName: 'Jesse'}, {firstName: 'Oliver'}, {firstName: 'Bruce'}])
      .then(function(result)
      {
        return userCollection.getAllUsers();
      })
      .then(function(result)
      {
        expect(result.length).to.equal(3);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('can create a user if none exist', function(done)
  {
    userCollection.createUser('jesterxl@jessewarden.com', 'JesterXL', 'somepass')
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('cannot create a user if someone has same email address but different username', function(done)
  {
    userCollection.createUser('jesterxl@jessewarden.com', 'JesterXL', 'somepass')
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return userCollection.createUser('jesterxl@jessewarden.com', 'cow', 'moo');
    })
    .then(function()
    {
      done(new Error('allowed 2 users with same email address through'));
    })
    .catch(function(error)
    {
      expect(error.message).to.equal('Email address already exists.');
      done();
    });
  });

});


