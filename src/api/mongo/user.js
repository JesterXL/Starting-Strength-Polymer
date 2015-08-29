var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

var _db = null;

var createUser = async (function(email, username, password)
{
	var foundUser = await (_db.collection("user").findOne({email: email}));
	if(foundUser !== null)
	{
		return new Error('Email address already exists.');
	}
	var result = await (_db.collection("user")
	.insertOne({email: email, username: username, password: password, createdOn: new Date()}));
	return result.result.ok === 1;
});

var findUser = async (function(user)
{
	return await (_db.collection("user").findOne(user));
});

var removeUser = async (function(user)
{
	var result = await (_db.collection("user").remove(user));
	return result.result.ok === 1;
});

var removeAll = async (function()
{
	var result = await (_db.collection("user").remove({}));
	return result.result.ok === 1;
});

var getAllUsers = async (function()
{
	return await (_db.collection("user").find({}).toArray());
});

var updateUsername = async (function(currentUsername, newUsername)
{
	var result = await (_db.collection("user")
	.updateOne({username: currentUsername}, {$set: {username: newUsername}}, {upsert: true}));
	return result.result.ok === 1;
});

module.exports = {
	createUser: createUser,
	removeUser: removeUser,
	removeAll: removeAll,
	getAllUsers: getAllUsers,
	updateUsername: updateUsername,
	findUser: findUser,

	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	}
};