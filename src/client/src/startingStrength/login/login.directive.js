(function() {
    'use strict';

    angular
        .module('startingStrength.login')
        .directive('jxlLogin', jxlLogin);

    function jxlLogin()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            template: '<login-view></login-view>',
            controller: 'jxlLoginController',
            controllerAs: 'vm'
        };
    }

})();
