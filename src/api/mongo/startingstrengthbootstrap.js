var Promise = require('bluebird');

var _db = null;

function programInitIsThere()
{
	// console.log("programInitIsThere");
	return new Promise(function(success, failure)
	{
		_db.collection("programinit")
		.find({initialized: true})
		.toArray()
		.then(function(result)
		{
			if(result.length > 0)
			{
				// console.log("found an init document");
				success(true);
			}
			else
			{
				// console.log("no init document exists");
				success(false);
			}
		})
		.catch(function(err)
		{
			failure(err);
		});
	});
}

function insertInitialization()
{
	console.log("insertInitialization");
	return new Promise(function(success, failure)
	{
		return _db.collection("programinit")
		.insert({initialized: true})
		.then(function(result)
		{
			if(result.result.ok === 1)
			{
				console.log("inserted init document");
				// success(true);
				return insertDefaultSchedules();
			}
			else
			{
				// console.log("failed to insert init document");
				failure(new Error("Result was not ok: " + result.result));
			}
		})
		.then(function(result)
		{
			if(result === true)
			{
				success(true);
			}
			else
			{
				success(false);
			}
		});
	})
	.catch(function(error)
	{
		failure(error);
	});
}

function deleteEverything()
{
	// console.log("deleteEverything");
	return new Promise(function(success, failure)
	{
		return _db.collection("programinit")
		.remove({})
		.then(function(result)
		{
			if(result.result.ok === 1)
			{
				console.log("removeing all in schedule...");
				return _db.collection('schedule')
				.remove({});
			}
			else
			{
				failure("Result1 was not ok: " + result.result);
			}
		})
		.then(function(result)
		{
			console.log("removed all schedules, result:", result.result.ok);
			success(true);
			return;
			
			if(result.result.ok === 1)
			{
				success(true);
			}
			else
			{
				failure("Result2 was no ok: " + result.result);
			}
		})
		.catch(function(err)
		{
			failure(err);
		});
	});
}

function initialize()
{
	console.log("initialize");
	return new Promise(function(success, failure)
	{
		return programInitIsThere()
		.then(function(isThere)
		{
			console.log("isThere:", isThere);
			if(isThere === true)
			{
				success(true);
			}
			else
			{
				return insertInitialization();
			}
		})
		.then(function(injected)
		{
			if(injected === true)
			{
				success(true);
			}
			else
			{
				success(false);
			}
		});
	})
	.catch(function(error)
	{
		reject(error);
	});
}

function insertDefaultSchedules()
{
	console.log("insertDefaultSchedules");
	return new Promise(function(success, failure)
	{
		try
		{
			var level1schedule = require('./workouts/fixtures/level1schedule');
			var level2schedule = require('./workouts/fixtures/level2schedule');
			var level3schedule = require('./workouts/fixtures/level3schedule');


			return _db.collection("schedule")
			.insertMany([level1schedule, level2schedule, level3schedule])
			.then(function(result)
			{
				console.log("insert many, result.result.ok:", result.result.ok);
				if(result.result.ok === 1)
				{
					success(true);
				}
				else
				{
					failure(new Error("Result was not ok: " + result.result));
				}
			})
			.catch(function(err)
			{
				console.log("insert many failed:", err);
				failure(err);
			});
		}
		catch(e)
		{
			console.log("insertDefaultSchedules failed:", e);
			failure(e);
		}
	})
	.catch(function(error)
	{
		failure(error);
	});
}

var startingStrengthBootstrap = {
	initialize: initialize,
	deleteEverything: deleteEverything,
	get db()
	{
		return _db;
	},

	set db(newDB)
	{
		_db = newDB;
	},
};

module.exports = startingStrengthBootstrap;