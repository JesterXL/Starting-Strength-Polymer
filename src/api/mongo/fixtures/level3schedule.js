var workoutSchedule = {
    weekA: [{
        days: ['first', 'third'],
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
        days: ['second'],
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
        days: ['second'],
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
        days: ['first', 'third'],
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
    }]
};
workoutSchedule.name = 'level3';
module.exports = workoutSchedule;