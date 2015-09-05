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
            template: '<app-view></app-view>',
            controller: 'jxlStartingStrengthController',
            controllerAs: 'vm'
        };
    }

})();
