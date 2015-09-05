(function() {
    'use strict';

    angular
        .module('startingStrength')
        .directive('jxlStartingStrength', jxlStartingStrength);

    function jxlStartingStrength()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'src/startingStrength/startingStrength.directive.html',
            controller: 'jxlStartingStrengthController',
            controllerAs: 'vm'
        };
    }

})();
