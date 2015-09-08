(function() {
    'use strict';

    angular
        .module('routerWrapper', ['ui.router'])
        .config(configureRoutes)
        .run(init);

    /* @ngInject */
    function configureRoutes($stateProvider)
    {
        $stateProvider
            .state('loading', {
                url: '/loading'
            })
            .state('login', {
                url: '/login'
            })
            .state('register', {
                url: '/register'
            })
            .state('today', {
                url: '/today'
            })
            .state('exercise', {
                url: '/exercise'
            });
    }

    /* @ngInject */
    function init($rootScope, $state)
    {
        console.log('routerWrapper::init');
        // RxJS
        window.pubsub = new Rx.Subject();

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams)
        {
            console.log("*** stateChangeStart", toState);
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
        {
            console.log("*** stateChangeSuccess", toState);
            pubsub.onNext('state-change', toState);
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams)
        { 
            console.log("*** stateNotFound");
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error)
        {
            console.log("*** stateChangeError");
        });
    }

})();
