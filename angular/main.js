/**
 * Gaming app main file
 */

var gamingApp = angular.module("gaming", ['ngRoute', 'ngTouch', 'ngAnimate', 'ui.bootstrap', 'ngSanitize']);
gamingApp.version = "1.1.0";
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

}).directive('appendVersion', function () {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, elem, attr) {
            if (attr.href)
                attr.$set("href", attr.href + "?v=" + gamingApp.version);

            if (attr.src)
                attr.$set("src", attr.src + "?v=" + gamingApp.version);
        }
    };
});

angular.module('app', []).run(function($localStorage) {

    var _beforeRequest = videojs.Hls.xhr.beforeRequest;
    videojs.Hls.xhr.beforeRequest = function(options) {
        if (_.isFunction(_beforeRequest)) {
            options = _beforeRequest(options);
        }
        if ($localStorage.token) {
            options.headers = options.headers || {};
            options.headers.Authorization = 'Token ' + $localStorage.token;
        }
        return options;
    };
});



