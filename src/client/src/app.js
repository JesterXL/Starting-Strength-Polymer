(function() {
    'use strict';

    angular
        .module('startingStrengthApp', [
            'ui.router',
            'startingStrength'])
        .run(init);

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
