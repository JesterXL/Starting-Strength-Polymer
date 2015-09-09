console.log('Loading restify server...');

var _ = require('lodash');
var Client = require('./mongo/client');
var startingStrength = require('./mongo/startingStrength');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var jwt = require('jsonwebtoken');

var client = new Client();
var db = null;
client.connect().then(function() {
    db = client.db;
    startingStrength.db = db;
    startingStrength.bootstrap.deleteEverything()
    .then(function(result)
    {
        console.log("startingStrengthBootstrap::deleteEverything, result:", result);
        return startingStrength.bootstrap.initialize()
    })
    .then(function(result)
    {
        console.log("startingStrengthBootstrap::initialize, result:", result);
    })
    .catch(function(error)
    {
        console.error("startingStrengthBootstrap::initialize, error:", error);
    });
});

var restify = require('restify');
var api = restify.createServer({name: 'starting-strength'});
api.listen(process.env.PORT || 5000, function () {
    console.log('%s listening at %s', api.name, api.url)
});

api.pre(restify.CORS());
restify.CORS.ALLOW_HEADERS.push('authorization');
api.pre(restify.fullResponse());
api.use(restify.bodyParser());

var secret = 'moocow';

var jwtRestify = require('restify-jwt');

api.use(jwtRestify({ secret: secret}).unless({path: [
                                                    '/ping', 
                                                    '/', 
                                                    '/login', 
                                                    '/register']}));



api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

api.get('/', function(req, res) {
    console.log('default called');
    res.send(200);
});

api.post('/login', async (function(req, res)
{
    console.log("*** /login ***");
    try
    {
        var username = req.body.username;
        var password = req.body.password;
        var foundUser = await (startingStrength.userCollection.findUser({username: username, password: password}));
        if(_.isObject(foundUser))
        {
            // TODO: encrypt passwords
            var profile = {
                username: username,
                email: foundUser.email,
                id: foundUser._id
            };
            var token = jwt.sign(profile, secret, { expiresInMinutes: 60*5 });
            res.json({result: true, token: token});
        }
        else
        {
            res.json({result: false, error: "Either your password isn't correct, or that username doesn't exist."});
        }
    }
    catch(error)
    {
        console.error("login error:", error);
    }
}));

api.post('/register', async (function(req, res)
{
    console.log("*** /login ***");
    var username = req.body.username;
    var password = req.body.password;
    var email = req.body.email;
    var foundUser = await (startingStrength.userCollection.findUser({email: email}));
    if(_.isObject(foundUser))
    {
        res.json({result: false, error: "User already exists, please choose a different email address."})
    }
    else
    {
        var createdResult = await (startingStrength.userCollection.createUser(email, username, password));
        console.log("createdResult:", createdResult);
        if(createdResult)
        {
            res.json({result: true});
        }
        else
        {
            res.json({result: false, error: createdResult});
        }
        
    }
}));

api.get('/isloggedin', function(req, res) {
    console.log("*** /isloggedin ***");
    res.send(200);
});

api.get('/api/workouts/today', function(req, res)
{
    console.log("*** /api/workouts ***");
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret, function(err, decoded)
    {
        if(err)
        {
            console.error("/api/workouts/today failed to verify token:", err);
            res.send(401);
        }
        startingStrength.userCollection.findUser({id: decoded._id})
        .then(function(user)
        {
            if(_.isObject(user))
            {
                return startingStrength.workoutCollection.getTodaysWorkout(user, new Date());
            }
            else
            {
                console.error("/api/workouts/today can't find user in token.");
                res.send(401);
            }
        })
        .then(function(workout)
        {
            if(_.isObject(workout))
            {
                res.json({result: true, workout: workout});
            }
            else
            {
                res.send(500, 'Could not get todays workout.');
            }
        })
        .catch(function(error)
        {
            console.error("/api/workouts/today error:", error);
            res.send(401);
        });
    });
});

api.post('/api/workouts/save', function(req, res)
{
    console.log("*** /api/workouts/save ***");
    var token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, secret, function(err, decoded)
    {
        if(err)
        {
            console.error("/api/workouts/today failed to verify token:", err);
            res.send(401);
        }
        startingStrength.userCollection.findUser({id: decoded._id})
        .then(function(user)
        {
            if(_.isObject(user))
            {
                console.log("req.body:", req.body.workout);
                return startingStrength.workoutCollection.saveWorkout(user, req.body.workout);
            }
            else
            {
                console.error("/api/workouts/save can't find user in token.");
                res.send(401);
            }
        })
        .then(function(saved)
        {
        	console.log("saved.insertedId:", saved.insertedId);
            if(saved.result.ok === 1)
            {
            	return startingStrength.workoutCollection.getWorkout({id: saved.insertedId});
            }
            else
            {
                res.send(500, 'Could not save workout.');
            }
        })
        .then(function(workout)
        {
            if(workout)
            {
            	res.json({result: true, workout: workout});
            }
            else
            {
                res.send(500, 'Could not save workout.');
            }
        })
        .catch(function(error)
        {
            console.error("/api/workouts/save error:", error);
            res.send(500);
        });
    });
});



