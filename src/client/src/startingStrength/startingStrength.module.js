(function() {
    'use strict';

    angular
        .module('startingStrength', [
            'ui.router',
            'startingStrength.userModel',
            'startingStrength.today'
            ])
        .run(init);

    /* @ngInject */
    function init($state)
    {
        console.log('startingStrength::init');
        // if($state.current.name == '')
        // {
        //     $state.go('macros');
        // }
    }

})();
