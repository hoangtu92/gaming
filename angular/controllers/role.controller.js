gamingApp.controller("roleController", function ($scope, $rootScope, $location, $route, $http, $infoModal, $timeout) {

    $scope.currentVideoPlaying = false;

    /**
     * Unlock user video
     */

    $scope.$on("role_loaded", function (evt, role) {
        $http.get(localStorage.base_api + "game/getSession", {params: {roleId: role.id}}).then(function (res) {
            $scope.gaming = res.data;

            if($scope.currentRole.video == null){
                $http.get(localStorage.base_api + "role/getPlayableUrl", {params: {id: $scope.currentRole.id}}).then(function (value) {
                    $scope.currentRole.video = value.data.model + "?t=" + localStorage.session_token;
                });
            }

        }, function () {
            $location.url("role-game/" + role.id)
        })
    });

    $scope.videoElement = document.querySelector("#videoPlay");

    $scope.playVideo = function (video) {


        if(typeof video !== 'undefined'){
            $scope.videoElement.setAttribute("poster", $scope.path['role_video_image'] + video.cover);

            $scope.selectedVideo = video;
            $scope.currentVideoPlaying = $scope.selectedVideo.id;

            if($scope.path['role_video'].match(/http/)){
                $http.get(localStorage.base_api + "roleVideo/getPlayableSource", {
                    params: {uid : video.uid}
                }).then(function (res) {

                    $scope.selectedVideo.src = res.data.model;

                    $scope.videoElement.setAttribute('src', $scope.selectedVideo.src);
                    $scope.videoElement.play();

            });
            }
            else{
                $scope.videoElement.setAttribute('src', localStorage.base_api + "roleVideo/play/" + $scope.selectedVideo.uid + "?t=" + localStorage.session_token);
                $scope.videoElement.play();
            }


        }
        else{
            $scope.videoElement.play();
        }



    };

    $scope.pauseVideo = function(video){
        if($scope.videoElement.paused){
            $scope.videoElement.play();
            $scope.currentVideoPlaying = video.id;
        }

        else {
            $scope.videoElement.pause();
        }
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