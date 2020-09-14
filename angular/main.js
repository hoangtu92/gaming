/**
 * Gaming app main file
 */

var gamingApp = angular.module("gaming", ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'ui.swiper']);
gamingApp.run(function ($rootScope, $http, $templateCache, $uibModalStack) {

    $http.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
    $http.defaults.cache = false;

    if(typeof sessionStorage.gaming_session === 'undefined')
        sessionStorage.gaming_session = new Date().getTime();

    $http.defaults.headers.common['Session-Token'] = sessionStorage.gaming_session;
    $http.defaults.headers.common['Authorization'] = "Bearer " + localStorage.session_token;


    $rootScope.$on('$locationChangeStart', function () {
        $uibModalStack.dismissAll();
    });

    $rootScope.cancel = function () {
        $uibModalStack.dismissAll();
    };
    $http.get('includes/modals/info.htm', {cache: $templateCache});


}).factory('httpPreConfig', ['$http', '$rootScope', function ($http, $rootScope) {
    $http.defaults.transformRequest.push(function (data) {
        $rootScope.$broadcast('httpCallStarted');
        return data;
    });
    $http.defaults.transformResponse.push(function (data) {
        $rootScope.$broadcast('httpCallStopped');
        return data;
    });
    return $http;
}]).service('ConfigService', function ($http, $q) {

    this.getConfig = function () {
        var q = $q.defer();
        $http.get('config.json').then(function (res) {
            q.resolve(res.data)
        }, function (reason) {
            q.reject(reason)
        });

        return q.promise;
    };

});



