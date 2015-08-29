var workoutSchedule = {
    weekA: [{
        days: [1, 3, 5],
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
    },
    
    {
        days: [0, 2, 4, 6]
    }]
};
workoutSchedule.name = 'level1';
module.exports = workoutSchedule;