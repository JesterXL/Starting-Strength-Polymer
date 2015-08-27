var Promise = require('bluebird');

var _db = null;

var userCollection = {

	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	},

	createUser: function(email, username, password)
	{
		return new Promise(function(resolve, reject)
		{
			userCollection.findUser({email: email})
			.then(function(foundUsers)
			{
				if(foundUsers.length > 0)
				{
					reject(new Error('Email address already exists.'));
				}
				else
				{
					return userCollection.insertUser({email: email, username: username, password: password});
				}
			})
			.then(function(result)
			{
				resolve(result);
			})
			.catch(function(err)
			{
				reject(err);
			});
		});
	},

	insertUser: function(user)
	{
		return new Promise(function(resolve, reject)
		{
			try
			{
				var collection = _db.collection("user");
				user._dateCreated = new Date();
				collection.insert(user, function(error, result)
				{
					if(error)
					{
						reject(error);
					}
					else
					{
						resolve(result);
					}
				});
			}
			catch(err)
			{
				reject(err);
			}
		});
	},

	updateUser: function(user, newUser)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("user");
			collection.update(user, newUser, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		}); 
	},

	removeUser: function(user)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("user");
			collection.remove(user, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	removeAll: function()
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("user");
			collection.remove({}, function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	findUser: function(user)
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("user");
			collection.find(user).toArray(function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	},

	getAllUsers: function()
	{
		return new Promise(function(resolve, reject)
		{
			var collection = _db.collection("user");
			collection.find({}).toArray(function(error, result)
			{
				if(error)
				{
					reject(error);
				}
				else
				{
					resolve(result);
				}
			});
		});
	}
};

module.exports = userCollection;