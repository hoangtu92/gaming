var openDepositPage = function(){
    window.pricePlanTab = window.open("/#!monthly-stored-value", '_blank');

    window.pricePlanInterval = window.setInterval(function() {
        try {
            if (pricePlanTab == null || window.pricePlanTab.closed) {
                window.clearInterval(window.pricePlanInterval);
                //Reload current tab when price plan page is done
                window.location.reload();
            }
        }
        catch (e) {
        }
    }, 1000);
};

gamingApp.config(function ($httpProvider, $qProvider) {

    $httpProvider.interceptors.push('httpInterceptor');

    $qProvider.errorOnUnhandledRejections(false);

}).factory('httpInterceptor', function ($q, $injector, $timeout, $rootScope) {

    var applicationLoaded = false,
        requestsCounter = 0,
        responsesCounter = 0,
        applicationSeemsToBeLoaded;

    return {
        request: function(config) {

            if (config.beforeSend)
                config.beforeSend();


            if (!applicationLoaded) {

                requestsCounter++;

                if (applicationSeemsToBeLoaded) {
                    $timeout.cancel(applicationSeemsToBeLoaded);
                }

                $rootScope.$broadcast('application_loading', {
                    requests: requestsCounter,
                    responses: responsesCounter
                });

            }

            return config || $q.when(config);
        },
        response: function (response) {
            if (!applicationLoaded) {

                responsesCounter++;

                $rootScope.$broadcast('application_loading', {
                    requests: requestsCounter,
                    responses: responsesCounter
                });

                if (requestsCounter - responsesCounter < 1) {
                    applicationSeemsToBeLoaded = $timeout(function () {
                        $rootScope.$broadcast('application_loaded');
                        applicationLoaded = true;
                    }, 200);
                }

            }

            return response || $q.when(response);
        },
        requestError: function(){
            $rootScope.$broadcast('application_loaded');
        },
        responseError: function (rejection) {
            $rootScope.$broadcast('application_loaded');

            if(!rejection.config.url.match(/signIn/) && !rejection.config.url.match(/signUp/)){
                if(rejection.status === 302 || rejection.status === 307){
                    window.location.href = "/#!dashboard";
                }
                else if (rejection.status === 403) { //FORBIDDEN
                    window.location.href = "/#!login";
                }
                else if(rejection.status === 500){ //INTERNAL SERVER ERROR
                    //window.location.href = "/";
                }
                else if(rejection.status === 402){ //PAYMENT_REQUIRED
                    $injector.get("$infoModal").open(rejection.data.message, openDepositPage);
                }
                else if(rejection.status === 423 ){//Locked
                    //Handle in controller
                }
                else if(rejection.status === 406){//406 NOT_ACCEPTABLE
                    //Handle in controller
                }
                //400 BAD_REQUEST

                else{
                    $injector.get("$infoModal").open(rejection.data.message)
                }
            }
            else{
                if (rejection.status === 403) { //FORBIDDEN

                }
                if (rejection.status === 500) { //INTERNAL SERVER ERROR

                }
                else{
                    $injector.get("$infoModal").open(rejection.data.message)
                }

            }

            return $q.reject(rejection);
        }
    };
});