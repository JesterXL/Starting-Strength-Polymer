var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var programCollection = require('./programCollection');
var _ = require("lodash");

var _db = null;

var findUser = async (function(user)
{
	return await (_db.collection("user").findOne(user));
});

var createUser = async (function(email, username, password)
{
	var foundUser = await (_db.collection("user").findOne({email: email}));
	if(foundUser !== null)
	{
		throw new Error('Email address already exists.');
	}
	var result = await (_db.collection("user")
	.insertOne({email: email, username: username, password: password, createdOn: new Date()}));
	if(result.result.ok !== 1)
	{
		throw new Error("Failed to insert user: " + result.result);
	}

	var newUser = await (findUser({email: email}));
	if(_.isObject(newUser) === false)
	{
		throw new Error("Couldn't find new user: " + newUser);
	}

	var mementoResult = await (programCollection.setUserMemento(newUser, 1, 'a', 'first'));
	return mementoResult;
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

var updateUsername = async (function(user, newUsername)
{
	var result = await (_db.collection("user")
	.updateOne(user, {$set: {username: newUsername}}, {upsert: true}));
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