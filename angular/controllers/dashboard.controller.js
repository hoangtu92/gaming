gamingApp.controller("dashboardController", function ($scope, $route, $routeParams, $http, $infoModal, $timeout, $location) {

    if(localStorage.showWelcome === '1'){
        $infoModal.open("親愛的<br>" +
            "歡迎回來<br>" +
            "今天也要加油<br>" +
            "把我脫光喔!")
    }

    localStorage.showWelcome = '0';

    $scope.owlOptions = {
        loop: false,
        margin: 25,
        nav: true,
        addClassActive: true,
        mouseDrag: false,
        pullDrag: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 6,
                nav: true,
                loop: false,
                margin: 10,
            },
            768: {
                items: 6,
                nav: true,
                loop: false,
                margin: 10
            },
            1000: {
                items: 6,
                nav: true,
                loop: false,
                margin: 20
            }
        }
    };

    if(typeof $routeParams.msg !== "undefined"){
        $infoModal.open($scope.b64DecodeUnicode($routeParams.msg));
    }
    $scope.setActiveItem = function(item){
        console.log(item);
        $scope.activeItem = item;
    }

    $scope.exit = function () {
        $infoModal.open("請愛的\n" +
            "你確定要離開，不再陪我玩一下嗎?", undefined, "再玩一下", function () {
            //logout
            $location.url("login");
            $timeout(function () {
                closeFullscreen();
            }, 200);
        }, "確定")
    }





});