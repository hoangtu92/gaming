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

}).factory('httpInterceptor', function ($q, $injector) {
    return {
        response: function (response) {
            return response || $q.when(response);
        },
        responseError: function (rejection) {

            if(!rejection.config.url.match(/signIn/)){
                if(rejection.status === 302 || rejection.status === 307){
                    window.location.href = "/#!dashboard";
                }
                else if (rejection.status === 403) { //FORBIDDEN
                    window.location.href = "/#!login";
                }
                else if(rejection.status === 500){ //INTERNAL SERVER ERROR
                    window.location.href = "/#!dashboard";
                }
                else if(rejection.status === 402){ //PAYMENT_REQUIRED

                    $injector.get("$infoModal").open(rejection.data.message, openDepositPage);

                }
                else if(rejection.status === 423 ){//Locked

                }
                //400 BAD_REQUEST
                //406 NOT_ACCEPTABLE
                else{
                    $injector.get("$infoModal").open(rejection.data.message)
                }
            }
            else{
                $injector.get("$infoModal").open(rejection.data.message)
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