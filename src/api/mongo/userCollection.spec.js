var should = require('chai').should();
var expect = require('chai').expect;
var user = require('./userCollection');
var Client = require('./client');
var Promise = require('bluebird');

describe('#userCollection', function()
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
        result.should.exist;
        done();
      })
      .catch(function(error)
      {
        done(error);
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
        result.should.exist;
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
      return user.updateUsername({username: 'jesterxl'}, 'Bruce');
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
      return user.createUser('oliver@jessewarden.com', 'Oliver', 'password');
    })
    .then(function(result)
    {
      return user.findUser({username: 'Jesse'});
    })
    .then(function(result)
    {
      result.should.exist;
      return user.updateUsername({username: 'Jesse'}, 'Grundy');
    })
    .then(function(result)
    {
      result.should.be.true;
      return user.findUser({username: 'Grundy'});
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
    user.createUser('jesse1@jessewarden.com', 'Jesse', 'password')
    .then(function(result)
    {
      return user.createUser('jesse2@jessewarden.com', 'Jesse', 'password');
    })
    .then(function(result)
    {
      return user.createUser('jesse3@jessewarden.com', 'Jesse', 'password');
    })
    .then(function(result)
    {
      return user.findUser({email: 'jesse2@jessewarden.com'});
    })
    .then(function(result)
    {
      result.should.exist;
      return user.updateUsername({email: 'jesse2@jessewarden.com'}, 'Grundy');
    })
    .then(function(result)
    {
      result.should.be.true;
      return user.findUser({username: 'Grundy'});
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

  it('user can add a user and then cannot find it', function(done)
  {
      user.createUser('jesse@jessewarden.com', 'Jesse', 'password')
      .then(function(result)
      {
        result.should.be.true;
        return user.findUser({username: 'Jesse'});
      })
      .then(function(result)
      {
        result.should.exist;
        return user.removeUser({email:'jesse@jessewarden.com'});
      })
      .then(function(result)
      {
        result.should.be.true;
        return user.createUser('jesse@jessewarden.com', 'Jesse', 'password');
      })
      .then(function(result)
      {
        result.should.be.true;
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('user can add a user and then cannot find it if you use wrong filter', function(done)
  {
      user.createUser('jesse@jessewarden.com', 'jesse', 'password')
      .then(function(result)
      {
        result.should.be.true;
        return user.findUser({username: 'cow'});
      })
      .then(function(result)
      {
        expect(result).to.be.null;
        done();
      })
      .catch(function(error)
      {
        done(error);
      });
  });

  it('adding 3 users results in finding 3 users for getAllUsers via Promise', function(done)
  {
      user.createUser('jesse@jessewarden.com', 'jesse', 'password')
      .then(function(result)
      {
        return user.createUser('oliver@jessewarden.com', 'Oliver', 'password');
      })
      .then(function(result)
      {
        return user.createUser('bruce@jessewarden.com', 'Bruce', 'password');
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
      Promise.all([user.createUser('jesse@jessewarden.com', 'jesse', 'password'),
          user.createUser('jesse@jessewarden.com', 'oliver', 'password'),
          user.createUser('jesse@jessewarden.com', 'bruce', 'password')])
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
      result.should.exist;
      done();
    })
    .catch(function(error)
    {
      done(error);
    });
  });

  it('cannot create a user if someone has same email address but different username', function(done)
  {
    console.log("1. create");
    user.createUser('jesterxl@jessewarden.com', 'JesterXL', 'somepass')
    .then(function(result)
    {
      result.should.be.true;
      console.log("2. create");
      return user.createUser('jesterxl@jessewarden.com', 'cow', 'moo');
    })
    .then(function(result)
    {
      console.log("result:", result);
      done(new Error('allowed 2 users with same email address through'));
    })
    .catch(function(error)
    {
      console.log("3. error:", error);
      expect(error.message).to.equal('Email address already exists.');
      done();
    });
  });

});


