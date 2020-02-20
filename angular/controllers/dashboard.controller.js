gamingApp.controller("dashboardController", function ($scope, $route, $http, $infoModal, $timeout) {

    $scope.carouselOptions = {
        loop: false,
        margin: 15,
        nav: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 5,
                nav: true
            },
            768: {
                items: 5,
                nav: false
            },
            1000: {
                items: 6,
                nav: true,
                loop: false
            }
        }
    };



});