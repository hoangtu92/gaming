gamingApp.controller("dashboardController", function ($scope, $route, $routeParams, $http, $infoModal, $timeout, $location) {

    if(localStorage.showWelcome === '1'){
        $infoModal.open("親愛的<br>" +
            "歡迎回來<br>" +
            "今天也要加油<br>" +
            "把我脫光喔!")
    }


   /* $scope.loaded = false;
    $scope.pictures = [

    ];

    preloader.preloadImages( $scope.pictures).then(function() {
        $scope.loaded = true;

    },function() {
        console.log('failed');
        // Loading failed on at least one image.
    });
*/

    $scope.previewVideo = '';

    localStorage.showWelcome = '0';

    $scope.owlOptions = {
        loop: false,
        margin: 25,
        nav: true,
        addClassActive: true,
        mouseDrag: false,
        touchDrag: true,
        freeDrag: false,
        rewind: false,
        pullDrag: false,
        slideBy: 1,
        dragEndSpeed: 1000,
        lazyLoad: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 6,
                nav: true,
                margin: 10,
            },
            768: {
                items: 6,
                nav: true,
                margin: 10
            },
            1000: {
                items: 6,
                nav: true,
                margin: 20
            }
        }
    };

    if(typeof $routeParams.msg !== "undefined"){
        $infoModal.open($scope.b64DecodeUnicode($routeParams.msg));
    }
    $scope.setActiveItem = function(item){
        //console.log(item);
        $scope.activeItem = item;
    };

    $scope.exit = function () {
        $infoModal.open("請愛的\n" +
            "你確定要離開，不再陪我玩一下嗎?", undefined, "再玩一下", function () {
            //logout
            $location.url("login");
            $timeout(function () {
                closeFullscreen();
            }, 200);
        }, "確定")
    };

    $scope.playPreview = function () {

        if($scope.currentRole.video != null){
            $scope.openModal('video_play');
        }
        else{
            $http.get(localStorage.base_api + "role/getPlayableUrl", {params: {id: $scope.currentRole.id}}).then(function (value) {
                $scope.currentRole.video = value.data.model + "?t=" + localStorage.session_token;
                $scope.openModal('video_play');
            });

        }

    }





});