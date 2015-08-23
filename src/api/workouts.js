var _ = require('lodash');
var defaultSchedule = require('./workouts/fixtures/defaultSchedule');

function validDate(date)
{
	return date.toString() !== 'Invalid Date';
}

function goodDate(date)
{
	return _.isDate(date) && validDate(date);
}

function getDefaultWorkoutSchedule()
{
	return defaultSchedule;
}

function getNextWorkoutDay(day)
{
	day += 2;
	if(day > 6)
	{
		return day -= 6;
	}
	return day;
}

var getThirdWorkoutDay = _.flow(getNextWorkoutDay, getNextWorkoutDay);

function getWorkoutDays(day)
{
	return [day, getNextWorkoutDay(day), getThirdWorkoutDay(day)];
}

function getWorkoutSchedule(workoutDay, callback)
{

	if(goodDate(workoutDay) === false)
	{
		callback(new Error('Bad Date.'));
	}
	else
	{
		var startDay = workoutDay.getDay();
		var workoutDays = getWorkoutDays(startDay);
		defaultSchedule[0].days = workoutDays;
		defaultSchedule[1].days = getRestDaysFromWorkoutDays(workoutDays);
		callback(null, defaultSchedule);
	}
}

function getRestDaysFromWorkoutDays(workoutDays)
{
	return _.difference([0, 1, 2, 3, 4, 5, 6], workoutDays);
}

function getWorkoutForToday()
{
	// var today = new Date().getDay();
	// var workoutSchedule = getDefaultWorkoutSchedule();
	// return _.find(workoutSchedule, function(schedule)
	// {
	// 	return _.includes(schedule.days, today);
	// }).exercises;
	

}

var workouts = {
	validDate: validDate,
	goodDate: goodDate,
	getDefaultWorkoutSchedule: getDefaultWorkoutSchedule,
	getWorkoutSchedule: getWorkoutSchedule,
	getWorkoutForToday: getWorkoutForToday

};

module.exports = workouts;