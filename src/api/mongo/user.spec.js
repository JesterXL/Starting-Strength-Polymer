var should = require('chai').should();
var expect = require('chai').expect;
var user = require('./user');
var Client = require('./client');
var Promise = require('bluebird');

describe('user API', function()
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
      user.db = db;
      return user.removeAll();
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
    user.removeAll()
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
    user.removeAll()
    .then(function()
    {
      done();
    })
    .error(function(err)
    {
      done(err);
    });
  });

  it('user is there', function()
  {
    expect(user).to.exist;
  });

  it('user has a db instance', function()
  {
    expect(user.db).to.exist;
  });

  it('user can add a user', function(done)
  {
      user.createUser('jesse@jessewarden.com', 'jesterxl', 'password')
      .then(function(result)
      {
        result.should.be.true;
        done();
      });
  });

  it('user can add a user and then find it', function(done)
  {
      user.createUser('jesse@jessewarden.com', 'jesterxl', 'password')
      .then(function(result)
      {
        result.should.be.true;
        return user.findUser({username: 'jesterxl'});
      })
      .then(function(result)
      {
        console.log("************* result:", result);
        expect(result.length).to.equal(1);
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('user can add a user, then update their name', function(done)
  {
    user.createUser('jesse@jessewarden.com', 'jesterxl', 'password')
    .then(function(result)
    {
      result.should.be.true;
      return user.findUser({username: "jesterxl"});
    })
    .then(function(result)
    {
      result.should.exist;
      return user.updateUsername('jesterxl', 'Bruce');
    })
    .then(function(result)
    {
      result.should.be.true;
      return user.findUser({username: 'Bruce'});
    })
    .then(function(result)
    {
      console.log("result:", result);
      result.should.exist;
      expect(result.username).to.equal('Bruce');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('user can add a user, then update its firstName with multiple items in there', function(done)
  {
    user.createUser('jesse@jessewarden.com', 'Jesse', 'password')
    .then(function(result)
    {
      return user.createUser('clark@jessewarden.com', 'Clark', 'password');
    })
    .then(function(result)
    {
      return user.insertUser('oliver@jessewarden.com', 'Oliver', 'password');
    })
    .then(function(result)
    {
      return user.findUser({username: 'Jesse'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(1);
      return user.updateUsername('Jesse', 'Grundy');
    })
    .then(function(result)
    {
      result.should.be.true;
       return user.findUser({firstName: 'Grundy'});
    })
    .then(function(result)
    {
      result.should.exist;
      result.username.should.equal('Grundy');
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('user can add a user, then update its name with multiple items of the same name in there', function(done)
  {
    user.insertUser({firstName: 'Jesse'})
    .then(function(result)
    {
      return user.insertUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      return user.insertUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      return user.findUser({firstName: 'Jesse'});
    })
    .then(function(result)
    {
      expect(result.length).to.equal(3);
      return user.updateUser({firstName: 'Jesse'}, {firstName: 'Grundy'});
    })
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return user.findUser({firstName: 'Grundy'});
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

  it('user can add a user and then cannot find it', function(done)
  {
      user.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return user.findUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.length).to.equal(1);
        return user.removeUser({firstName: 'Jesse'});
      })
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return user.findUser({firstName: 'Jesse'});
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

  it('user can add a user and then cannot find it if you use wrong filter', function(done)
  {
      user.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        expect(result.result.ok).to.equal(1);
        return user.findUser({firstName: 'cow'});
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
      user.insertUser({firstName: 'Jesse'})
      .then(function(result)
      {
        return user.insertUser({firstName: 'Oliver'});
      })
      .then(function(result)
      {
        return user.insertUser({firstName: 'Bruce'});
      })
      .then(function(result)
      {
        return user.getAllUsers();
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
      user.insertUser([{firstName: 'Jesse'}, {firstName: 'Oliver'}, {firstName: 'Bruce'}])
      .then(function(result)
      {
        return user.getAllUsers();
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
    user.createUser('jesterxl@jessewarden.com', 'JesterXL', 'somepass')
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
    user.createUser('jesterxl@jessewarden.com', 'JesterXL', 'somepass')
    .then(function(result)
    {
      expect(result.result.ok).to.equal(1);
      return user.createUser('jesterxl@jessewarden.com', 'cow', 'moo');
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


