var workoutSchedule = {
    weekA: [{
        days: [1, 5],
        exercises: [
            {
                name: 'Squat',
                sets: 3,
                reps: 5
            },

            {
                name: 'Overhead Press',
                sets: 3,
                reps: 5
            },

            {
                name: 'Deadlift',
                sets: 1,
                reps: 5
            }
        ]
    },

    {
        days: [3],
        exercises: [
            {
                name: 'Squat',
                sets: 3,
                reps: 5
            },

            {
                name: 'Bench Press',
                sets: 3,
                reps: 5
            },

            {
                name: 'Power Clean',
                sets: 5,
                reps: 5
            }
        ]
    }],

    weekB: [{
        days: [3],
        exercises: [
            {
                name: 'Squat',
                sets: 3,
                reps: 5
            },

            {
                name: 'Overhead Press',
                sets: 3,
                reps: 5
            },

            {
                name: 'Deadlift',
                sets: 1,
                reps: 5
            }
        ]
    },

    {
        days: [1, 5],
        exercises: [
            {
                name: 'Squat',
                sets: 3,
                reps: 5
            },

            {
                name: 'Bench Press',
                sets: 3,
                reps: 5
            },

            {
                name: 'Power Clean',
                sets: 5,
                reps: 5
            }
        ]
    },
    
    {
        days: [0, 2, 4, 6]
    }]
};
workoutSchedule.name = 'level3';
module.exports = workoutSchedule;