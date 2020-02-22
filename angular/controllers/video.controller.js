gamingApp.controller("videoController", function ($scope, $route, $http, $infoModal, $timeout) {

    /**
     * Videos
     */

    $scope.getListVideoTags = function () {
        $http.get(base_api + "video/tags").then(function (res) {
            $scope.videoTags = res.data;
        });
    };





    $scope.getVideos = function (cat, tag) {

        $scope.currentFilter = tag;

        $http.get(base_api + "video/filter", {
            params: {
                tagName: tag,
                catName: cat
            }
        }).then(function (res) {
            $scope.videos = res.data.model;
        });
    };





});