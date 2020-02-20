gamingApp.controller("pricePlanController", function ($scope, $route, $http, $infoModal, $timeout) {

    $scope.deposit = function (pricePlan) {
        $http.get(base_api + "price-plan/deposit", {params: {price_plan_id: pricePlan.id}}).then(function (res) {

        })
    };

});