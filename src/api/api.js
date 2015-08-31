console.log('Loading restify server...');

var _ = require('lodash');
var Client = require('./mongo/client');
var userCollection = require('./mongo/userCollection');
var async = require('asyncawait/async');
var await = require('asyncawait/await');

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

api.pre(restify.CORS({
    origins: ['*'],
    credentials: false,
    headers: ['X-Requested-With', 'Authorization']
}));
api.pre(restify.fullResponse());
api.use(restify.bodyParser());

// var passport = require('passport');
// var JwtStrategy = require('passport-jwt').Strategy;
// var opts = {}
// opts.secretOrKey = 'secret';
// opts.issuer = "accounts.jessewarden.com";
// opts.audience = "jessewarden.com";
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             done(null, user);
//         } else {
//             done(null, false);
//             // or you could create a new account
//         }
//     });
// }));

api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

api.get('/', function(req, res) {
    console.log('default called');
    res.send(200);
});

// api.post('/profile', passport.authenticate('jwt', { session: false}),
//     function(req, res)
//     {
//         console.log("*** /profile ***");
//         console.log("user:", req.user);
//         res.send(req.user.profile);
//     }
// );

// api.post('/login',
//   passport.authenticate('jwt', { session: false}),
//   function(req, res) {
//     // If this function gets called, authentication was successful.
//     // `req.user` contains the authenticated user.
//     res.json({response: true, user: req.user});
//   });

api.post('/login', function(req, res)
{
    console.log("*** /login ***");
    res.json({result: true});
});

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

api.get('/api/workouts/today', function(req, res)
{
    // TODO: calculate goal, for now hardcode
    console.log("*** /api/workouts ***");
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



