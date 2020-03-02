gamingApp.controller("userController", function ($scope, $route, $routeParams, $location, $http, $infoModal, $timeout) {


    if($routeParams.username){
        $http.post(localStorage.base_api + "user/verify", JSON.stringify({
            username: $routeParams.username,
            code: $routeParams.code
        })).then(function () {
            $infoModal.open("驗證成功，請登錄以繼續");

        });
    }

    $scope.$on("uploadFile", function (evt, files) {

        if(typeof files[0] === 'undefined') return;

        var data = new FormData();

        data.append("id", $scope.currentUser.id);
        data.append("avatar", files[0]);

        $http({
            url: localStorage.base_api + 'user/update',
            method: 'POST',
            data: data,
            headers: {
                'Content-Type': undefined
            }
        }).then(function () {
            $scope.getCurrentUser();
        })

    });

    $scope.getCredits = function () {
        $http.get(localStorage.base_api + "user/transactions").then(function (res) {
            $scope.credits = res.data;
        })
    };

});