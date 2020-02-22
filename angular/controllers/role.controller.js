gamingApp.controller("roleController", function ($scope, $rootScope, $location, $route, $http, $infoModal, $timeout) {


    /**
     * Unlock user video
     */

    $scope.$on("role_loaded", function (evt, role) {
        $http.get(base_api + "game/getSession", {params: {roleId: role.id}}).then(function (res) {
            $scope.gaming = res.data;
        }, function () {
            $location.url("role-game/" + role.id)
        })
    });

    $scope.videoElement = null;

    $scope.playVideo = function (video) {

        $scope.videoElement = document.querySelector("#videoPlay");
        $scope.videoElement.setAttribute("poster", $scope.path['role_video_image'] + video.cover);
        $scope.selectedVideo = video;
        $http.get(localStorage.base_api + "roleVideo/getPlayableSource", {
            params: {uid : video.uid}
        }).then(function (res) {

            $scope.selectedVideo.src = res.data.model;
            $scope.selectedVideo.playing = true;

            $scope.videoElement.setAttribute('src', $scope.path['role_video'] + $scope.selectedVideo.src);
            $scope.videoElement.play();

            });

    };

    $scope.$on("close_window", function (evt, e) {

        var xhttp = new XMLHttpRequest();

        xhttp.open("GET", localStorage.base_api + "game/closeSession", false);
        xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.session_token);
        xhttp.setRequestHeader("Session-ID", $scope.gaming.id);
        xhttp.send();

    })

});