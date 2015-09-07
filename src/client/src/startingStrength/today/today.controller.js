(function () {

	angular.module("startingStrength.today")
		.controller("jxlTodayController", jxlTodayController);

	/* @ngInject */
    function jxlTodayController($state, $rootScope, $location, $http, userModel)
    {
        console.log("jxlTodayController:::constructor");
        var vm = this;
        vm.workout = null;
        $http.get('http://localhost:5000/api/workouts/today').then(function(response)
        {
        	console.log("jxlTodayController::workouts today, response:", response);
        	vm.workout = response.workout;
        })
        .catch(function(error)
        {
        	console.error("jxlTodayController::workouts today, error:", error);
        });
    }
})();
