(function() {
    'use strict';

    angular
        .module('startingStrength')
        .config(configureRoutes);

    /* @ngInject */
    function configureRoutes($stateProvider)
    {
        $stateProvider
            .state('loading', {
                url: '/loading',
                template: '<loading-view></loading-view>'
            })
            .state('login', {
                url: '/login',
                template: '<login-view></<login-view>'
            })
            .state('register', {
                url: '/register',
                template: '<register-view></register-view>'
            })
            .state('today', {
                url: '/today',
                template: '<jxl-today></jxl-today>'
            })
            .state('exercise', {
                url: '/exercise',
                template: '<exercise-view></exercise-view>'
            });
    }

})();