gamingApp.controller("dashboardController", function ($scope, $route, $routeParams, $http, $infoModal, $timeout) {

    $scope.owlOptions = {
        loop: false,
        margin: 15,
        nav: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 2,
                nav: false,
                loop: false
            },
            768: {
                items: 3,
                nav: false,
                loop: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: false
            }
        }
    };

    function b64DecodeUnicode(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    }

    if(typeof $routeParams.msg !== "undefined"){
        $infoModal.open(b64DecodeUnicode($routeParams.msg));
    }





});