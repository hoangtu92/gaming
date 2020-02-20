gamingApp.controller("roleController", function ($scope, $route, $http, $infoModal, $timeout) {


    /**
     * Unlock user video
     */

    $scope.unlockVideo = function (video_id) {
        $http.post(base_api + "roleVideo/unlock", JSON.stringify({
            id: video_id,
            token: ""
        })).then(function (res) {
            $scope.getCurrentUser();
            $infoModal.open("影片已解鎖成功！扣除" + res.data.model.amount.formatPrice() + "G幣")
        })
    };

    $scope.playVideo = function (video) {
        $scope.selectedVideo = video;
        video.playing = true;
        setTimeout(function () {
            document.querySelector("#videoPlay").play();
        })
    };

});