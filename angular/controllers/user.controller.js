gamingApp.controller("userController", function ($scope, $route, $routeParams, $location, $http, $infoModal, $timeout) {

    var circleValue = document.querySelector('#circle-value');

    var circleLength  = circleValue != null ? circleValue.getTotalLength() : 0;


    $scope.initProgressCircle = function () {
        angular.element(circleValue).css({"stroke-dashoffset": circleLength, "stroke-dasharray": circleLength});
    };

    $scope.$on("user_loaded", function (e, currentUser) {
        var percent = currentUser.gameProgress.round();
        var value = circleLength - (percent*circleLength)/100;

        angular.element(circleValue).animate({
            "stroke-dashoffset": value
        });
    });

    if($routeParams.action){

        if($routeParams.action === "verify"){
            $http.post(localStorage.base_api + "user/verify", JSON.stringify({
                uid: $routeParams.uid,
                code: $routeParams.code
            })).then(function () {
                $infoModal.open("驗證成功，請登錄以繼續");
            });
        }
        else{
            $scope.$parent.user = {
                uid: $routeParams.uid,
                code: $routeParams.code
            };
            $scope.openModal("email_change_password")
        }


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