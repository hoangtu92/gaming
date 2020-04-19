gamingApp.controller("pricePlanController", function ($scope, $route, $http, $routeParams, $infoModal, $timeout) {


    if(typeof $routeParams.msg !== "undefined"){
        $infoModal.open($scope.b64DecodeUnicode($routeParams.msg));
    }




});