(function() {
    'use strict';

    angular.module("startingStrength")
        .config(jwtConfig)
        .factory('jxlJWTHTTPInterceptorFactory', jxlJWTHTTPInterceptorFactory);

    /* @ngInject */
    function jwtConfig($httpProvider)
    {
    	$httpProvider.interceptors.push('jxlJWTHTTPInterceptorFactory');
    }

	function jxlJWTHTTPInterceptorFactory($q, userModel)
	{
		return {
			'request': function(config)
			{
				if(userModel.hasToken())
				{
					config.headers['Authorization'] = 'Bearer ' + userModel.token;
				}
				return config;
			}
		};
	}

})();
