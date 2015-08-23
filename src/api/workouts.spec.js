var should = require('chai').should();
var _ = require('lodash');
var workouts = require('./workouts');
var moment = require('moment');

describe('#workouts', function() {
    'use strict';
    describe('#date validation', function()
    {
    	it('validates a good date', function() {
	    	var date = new Date();
	        workouts.validDate(date).should.be.true;
	    });
	    it('validates a bad date', function() {
	    	var badDate = new Date('cow');
	        workouts.validDate(badDate).should.be.false;
	    });
	    it('enures a good date', function() {
	    	var date = new Date();
	        workouts.goodDate(date).should.be.true;
	    });
	    it('enures a bad date', function() {
	    	var badDate = new Date('cow');
	        workouts.goodDate(badDate).should.be.false;
	    });
	    it('enures a bad date even if not a true Date object', function() {
	    	var badDate = 'moo';
	        workouts.goodDate(badDate).should.be.false;
	    });
    });

    describe('#default schedule validation', function()
    {
    	it('returns a default schedule', function()
    	{
    		workouts.getDefaultWorkoutSchedule().should.not.be.empty;
    	});
    	it('default schedule starts on Monday', function()
    	{
    		workouts.getDefaultWorkoutSchedule()[0].days[0].should.equal(1);
    	});
    	it('default schedule rest day starts on Sunday', function()
    	{
    		workouts.getDefaultWorkoutSchedule()[1].days[0].should.equal(0);
    	});
    });

    describe('#getWorkoutSchedule', function()
    {
    	it('returns a schedule if you supply a valid date', function(done)
    	{
    		workouts.getWorkoutSchedule(new Date(), function(err, schedule)
    		{
    			if(err)
    			{
    				done(err);
    			}
    			else
    			{
    				schedule.should.not.be.empty;
    				done();
    			}
    		});
    	});
    	it('fails with an error if you supply a bad date', function(done)
    	{
    		workouts.getWorkoutSchedule(new Date('cow'), function(err, schedule)
    		{
    			if(err)
    			{
    				err.should.not.be.null;
    				done();
    			}
    			else
    			{
    				done(new Error("should not succeed"));
    			}
    		});
    	});
    	it('returns Monday, Wednesday, Friday for a Monday start date', function(done)
    	{
    		var monday = moment();
    		monday.day('Monday');
    		workouts.getWorkoutSchedule(monday.toDate(), function(err, schedule)
    		{
    			if(err)
    			{
    				done(err);
    			}
    			else
    			{
    				schedule[0].days[0].should.equal(1);
    				done();
    			}
    		});
    	});
    	it('returns Wednesday, Friday, Sunday for a Wednesday start date', function(done)
    	{
    		var monday = moment();
    		monday.day('Wednesday');
    		workouts.getWorkoutSchedule(monday.toDate(), function(err, schedule)
    		{
    			if(err)
    			{
    				done(err);
    			}
    			else
    			{
    				schedule[0].days[0].should.equal(3);
    				done();
    			}
    		});
    	});
    });

    

    
 
});