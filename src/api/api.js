console.log('Loading restify server...');

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

api.get('/ping', function (req, res, next) {
    console.log("ping called");
    res.send(200, {response: true});
});

api.get('/', function(req, res) {
    console.log('default called');
    res.send(200);
});

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



