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
            transclude: true,
            templateUrl: 'src/startingStrength/startingStrength.directive.html',
            controller: 'jxlStartingStrengthController',
            controllerAs: 'vm'
        };
    }

})();
