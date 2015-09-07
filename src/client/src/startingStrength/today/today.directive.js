(function() {
    'use strict';

    angular
        .module('startingStrength.today')
        .directive('jxlToday', jxlToday);

    function jxlToday()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'src/startingStrength/today/today.directive.html',
            controller: 'jxlTodayController',
            controllerAs: 'vm'
        };
    }

})();
