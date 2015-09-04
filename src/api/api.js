console.log('Loading restify server...');

var _ = require('lodash');
var Client = require('./mongo/client');
var userCollection = require('./mongo/userCollection');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var jwt = require('jsonwebtoken');

var client = new Client();
var db = null;
client.connect().then(function() {
    db = client.db;
    userCollection.db = db;
});

var restify = require('restify');
var api = restify.createServer({name: 'starting-strength'});
api.listen(process.env.PORT || 5000, function () {
    console.log('%s listening at %s', api.name, api.url)
});

// api.pre(restify.CORS({
//     origins: ['*', 'localhost', '127.0.0.1:5000', '127.0.0.1:5000', 'localhost:3000', 'localhost:8626'],
//     credentials: false,
//     headers: ['X-Requested-With', 
//                 'Access-Control-Request-Method', 
//                 'Access-Control-Request-Headers', 
//                 'Access-Control-Allow-Origin',
//                 'Authorization']
// }));

api.pre(restify.CORS());
restify.CORS.ALLOW_HEADERS.push('authorization');
api.pre(restify.fullResponse());
api.use(restify.bodyParser());

// function unknownMethodHandler(req, res) {
//   if (req.method.toLowerCase() === 'options') {
//       console.log('received an options method request');
//     var allowHeaders = ['Accept', 'Accept-Version', 'Content-Type', 'Api-Version', 'Origin', 'X-Requested-With']; // added Origin & X-Requested-With

//     if (res.methods.indexOf('OPTIONS') === -1) res.methods.push('OPTIONS');

//     res.header('Access-Control-Allow-Credentials', true);
//     res.header('Access-Control-Allow-Headers', allowHeaders.join(', '));
//     res.header('Access-Control-Allow-Methods', res.methods.join(', '));
//     res.header('Access-Control-Allow-Origin', req.headers.origin);

//     return res.send(204);
//   }
//   else
//     return res.send(new restify.MethodNotAllowedError());
// }

// api.on('MethodNotAllowed', unknownMethodHandler);

var secret = 'moocow';

var jwtRestify = require('restify-jwt');

api.use(jwtRestify({ secret: secret}).unless({path: [
                                                    '/ping', 
                                                    '/', 
                                                    '/login', 
                                                    '/register',
                                                    '/api/workouts/today']}));



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
        var foundUser = await (userCollection.findUser({username: username, password: password}));
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
    var foundUser = await (userCollection.findUser({email: email}));
    if(_.isObject(foundUser))
    {
        res.json({result: false, error: "User already exists, please choose a different email address."})
    }
    else
    {
        var createdResult = await (userCollection.createUser(email, username, password));
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
    console.log(req.headers);
    res.send(200);
});

api.get('/api/workouts/today', function(req, res)
{
    // TODO: calculate goal, for now hardcode
    console.log("*** /api/workouts ***");
    console.log("authorization header:", req.headers.authorization);
    res.json([
            {
                name: 'Squat',
                sets: [
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    },
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    },
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    }
                ],
                goalSets: 3
            },

            {
                name: 'Bench Press',
                sets: [
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    },
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    },
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    }
                ],
                goalSets: 3
            },

            {
                name: 'Deadlift',
                sets: [
                    {
                        reps: null,
                        weight: 45,
                        goalReps: 5,
                        goalWeight: 45
                    }
                ],
                goalSets: 1

            }
        ]);
});

api.post('/api/workouts/exercise/save', function(req, res)
{
    console.log("*** /api/workouts/exercise/save ***");

    _.delay(function()
    {
        res.json({result: true});
    }, 1000);
});



