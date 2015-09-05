(function() {
    'use strict';

    angular
        .module('startingStrength', [
            'ui.router'
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
