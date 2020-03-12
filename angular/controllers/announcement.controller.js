gamingApp.controller("announcementController", function ($scope, $route, $http, $infoModal, $timeout) {

    $scope.owlOptions = {
        loop: false,
        margin: 0,
        nav: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            768: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: true,
                loop: false
            }
        }
    };

    $scope.getListNews = function () {
        $scope.$broadcast("before_load_item");
        $http.post(localStorage.base_api + "news/list", JSON.stringify({
            perPage: 10,
            page: 0
        })).then(function (res) {
            $scope.items = res.data.content;
            $scope.$broadcast("after_load_item");
        })
    };

});