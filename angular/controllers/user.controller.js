gamingApp.controller("userController", function ($scope, $route, $routeParams, $location, $http, $infoModal, $timeout) {

    var circleValue = document.querySelector('#circle-value');
    var circleValue2 = document.querySelector('#circle-value2');
    var circleLength  = circleValue != null ? Math.round(circleValue.getTotalLength()) : 0;
    var circleLength2  = circleValue2 != null ? Math.round(circleValue2.getTotalLength()) : 0;

    angular.element('#circle-value').css({"stroke-dashoffset": circleLength, "stroke-dasharray": circleLength});
    angular.element('#circle-value2').css({"stroke-dashoffset": circleLength2, "stroke-dasharray": circleLength2});

    $scope.getCurrentUser(function () {
        var percent = $scope.currentUser.gameProgress.round();
        var value = Math.round(Math.round(circleValue.getTotalLength()) - (percent*circleLength)/100);

        angular.element('#circle-value').animate({
            "stroke-dashoffset": value
        });
        angular.element('#circle-value2').animate({
            "stroke-dashoffset": value
        });

    });
    /*$scope.$on("user_loaded", function (e, currentUser) {


    });
*/
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