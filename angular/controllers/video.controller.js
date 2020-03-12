gamingApp.controller("videoController", function ($scope, $route, $http, $infoModal, $timeout) {

    /**
     * Videos
     */

    $scope.getListVideoTags = function () {
        $http.get(localStorage.base_api + "video/tags").then(function (res) {
            $scope.videoTags = res.data;
        });
    };









});