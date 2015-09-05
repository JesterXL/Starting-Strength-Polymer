/* global moment */
(function() {
    'use strict';

    angular
        .module('startingStrength.userModel', [
            ])
        .factory('userModel', userModel);

    /* @ngInject */
    function userModel($rootScope)
    {
        var _token = null;

        var model = {
            get token()
            {
                return window.localStorage.token;
            },

            set token(newToken)
            {
                if(_.isString(newToken))
                {
                    window.localStorage.token = newToken;
                }
                else
                {
                    delete window.localStorage.token;
                }
            },

            hasToken: function()
            {
                return _.isString(window.localStorage.token);
            }
        };

        
        return model;
    }

})();
