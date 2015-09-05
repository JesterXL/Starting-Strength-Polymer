(function () {

	angular.module("startingStrength")
		.controller("jxlStartingStrengthController", jxlStartingStrengthController);

	/* @ngInject */
    function jxlStartingStrengthController($state, $rootScope, $location, $http, userModel)
    {
        var vm = this;
        $http.get('http://localhost:5000/isloggedin').then(function(response)
        {
        	console.log("jxlStartingStrengthController::isloggedin, response:", response);
        })
        .catch(function(error)
        {
        	console.error("jxlStartingStrengthController::isloggedin, error:", error);
        });

    }
})();
