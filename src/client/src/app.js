(function() {
    'use strict';

    angular
        .module('startingStrengthApp', [
            'ui.router',
            'startingStrength'])
        .config(config)
        .run(init);

    /* @ngInject */
    function config($locationProvider)
    {
        // $locationProvider.html5Mode(false);
    }

    /* @ngInject */
    function init($state)
    {
        console.log('startingStrengthApp::init');
        // if($state.current.name == '')
        // {
        //     $state.go('macros');
        // }
    }

})();
