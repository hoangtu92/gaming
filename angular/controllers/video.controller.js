gamingApp.controller("videoController", function ($scope, $route, $http, $infoModal, $timeout) {

    /**
     * Videos
     */

    $scope.getListVideoTags = function () {
        $http.get(base_api + "video/tags").then(function (res) {
            $scope.videoTags = res.data;
        });
    };









});