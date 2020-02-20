gamingApp.config(function ($httpProvider, $qProvider) {

    $httpProvider.interceptors.push('httpInterceptor');

    $qProvider.errorOnUnhandledRejections(false);

}).factory('httpInterceptor', function ($q, $injector) {
    return {
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (rejection) {

            if(!rejection.config.url.match(/signIn/)){
                if (rejection.status === 403) {
                    window.location.href = "/#!login";
                }
                else{
                    $injector.get("$infoModal").open(rejection.data.message)
                }
            }

            return $q.reject(rejection);
        },
        // if beforeSend is defined call it
        request: function (request) {

            if (request.beforeSend)
                request.beforeSend();

            return request;
        }
    };
});