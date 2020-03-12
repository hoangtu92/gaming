gamingApp.controller("cardController", function ($scope, $rootScope, $route, $location, $http, $infoModal, $timeout, $interval) {

    var lvNames = {
        1: "一星", 2: "二星", 3: "三星", 4: "四星", 5: "五星", 6: "六星"
    };

    Object.prototype.toString = function(){
        var str = lvNames[1] + this[1] + "%\n";

        str += lvNames[2] + this[2] + "%\n";
        str += lvNames[3] + this[3] + "%\n";
        str += lvNames[4] + this[4] + "%\n";
        str += lvNames[5] + this[5] + "%\n";
        str += lvNames[6] + this[6] + "%\n";

        return str;

    };

    /**
     * Card
     */



    $scope.now = new Date();
    $interval(function () {
        $scope.now = new Date();
    }, 1);

    $scope.getRemainTime = function(date, now){
        return date.toDate().getRemainTime(now)
    };

    $scope.getListCards = function (level) {
        $scope.filterLevel = level;
        $http.get(base_api + "card/getLevels", {params: {level: level}}).then(function (res) {
            $scope.levels = res.data.model;
        });

    };

    $scope.$on("use_card", function (evt, cardLevel) {
        $scope.useCard(cardLevel);
    });
    $scope.$on("sell_card", function (evt, cardLevel) {
        $scope.sellCard(cardLevel);
    });

    $scope.useCard = function (cardLevel) {
        $http.get(localStorage.base_api + "card/use", {
            params: {id: cardLevel.id}
        }).then(function () {
            $scope.modal['card_detail'].close();
            $scope.getListUserCards();

        }).finally(function () {
            $location.url("card-select")
        })
    };
    $scope.sellCard = function (cardLevel) {
        $http.get(localStorage.base_api + "card/sell", {
            params: {id: cardLevel.id}
        }).then(function (res) {
            $scope.modal['card_detail'].close();
            $scope.getListUserCards();
            $scope.getCurrentUser(function () {
                $infoModal.open("道具牌已以" + $scope.viewingLevel.salePrice.formatPrice() + "G幣成功售出，您目前的餘額為" + $scope.currentUser.credit.formatPrice())
            })

        }, function (reason) {

        })
    };


    $scope.getListUserCards = function (level) {

        $scope.currentFilter = level;

        $http.get(localStorage.base_api + "card/getUserCardLevels", {
            params: {
                level: level
            }
        }).then(function (res) {
            $scope.levels = res.data.model;
        });

    };

    $scope.getInUsedCards = function(){
        $http.get(localStorage.base_api + "card/getInUsedCards").then(function (res) {
            $scope.inUsedCardlevels = res.data.model;
        });
    };




    /**
     * Card pool
     */

    $scope.getCardPools = function () {
        $http.get(localStorage.base_api + "card/getCardPools").then(function (res) {
            $scope.cardPools = res.data;
        });

        $http.get(localStorage.base_api + "card/getLimitedTimeCards").then(function (res) {
            $scope.limitedTimeCards = res.data;
        });
    }



});