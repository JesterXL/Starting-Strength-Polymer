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
    /*
        0: Sunday
        1: Monday
        2: Tuesday
        3: Wednesday
        4: Thursday
        5: Friday
        6: Saturday
     */
    var workouts = [
        {
            days: [1, 3, 5],
            notes: null,
            goal: "3x5x290",
            exercises: [
                {
                    name: 'Squat',
                    sets: [
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 295,
                            actualReps: 5
                        }
                    ]
                },

                {
                    name: 'Bench Press',
                    sets: [
                        {
                            reps: 5,
                            weight: 180,
                            actualReps: 5
                        },
                        {
                            reps: 5,
                            weight: 180,
                            actualReps: 5
                        }
                    ]
                },

                {
                    name: 'Deadlift',
                    sets: [
                        {
                            reps: 5,
                            weight: 315,
                            actualReps: 5
                        }
                    ]
                }
            ]
        },
        
        {
            days: [0, 2, 4, 6],
            notes: null,
            exercises: []
        }
    ];
    res.json(workouts);
});



