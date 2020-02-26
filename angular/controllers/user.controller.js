gamingApp.controller("userController", function ($scope, $route, $routeParams, $location, $http, $infoModal, $timeout) {


    if($routeParams.username){
        $http.post(localStorage.base_api + "user/verify", JSON.stringify({
            username: $routeParams.username,
            code: $routeParams.code
        })).then(function () {
            $infoModal.open("驗證成功，請登錄以繼續");

        });
    }

});