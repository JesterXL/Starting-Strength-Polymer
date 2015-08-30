var workoutSchedule = {
    weekA: [{
        days: ['first', 'second', 'third'],
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
                name: 'Deadlift',
                sets: 1,
                reps: 5
            }
        ]
    }]
};
workoutSchedule.name = 'level1';
module.exports = workoutSchedule;