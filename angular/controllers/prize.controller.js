gamingApp.controller("prizeController", function ($scope, $route, $http, $infoModal, $timeout) {


    /**
     * Prize
     */



    $scope.redeem = function () {
        var selectedPrize = $scope.prizes.reduce(function (t, e) {
            if (e.selected) t.push(e.id);
            return t;
        }, []);
        console.log(selectedPrize);

        $http.post(base_api + "prize/redeem", JSON.stringify(selectedPrize)).then(function (res) {
            $infoModal.open("獎勵已成功領取");
            $scope.getListPrizeLogs();
            $scope.getListPrizes();
        })
    };

    $scope.checkPrizes = false;
    $scope.checkAllPrizes = function () {
        $scope.checkPrizes = !$scope.checkPrizes;
        $scope.prizes = $scope.prizes.map(function (e) {
            e.selected = $scope.checkPrizes;
            return e;
        })
    };


});