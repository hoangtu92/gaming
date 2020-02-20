gamingApp.controller("cardController", function ($scope, $route, $location, $http, $infoModal, $timeout) {

    /**
     * Card
     */
    $scope.getListCards = function () {
        $http.get(base_api + "card/getCards").then(function (res) {
            $scope.cards = res.data.model;
        });

    };

    $scope.buyCard = function (card) {

        $http.post(base_api + "card/buy", JSON.stringify({
            id: card.id,
            token: ""
        })).then(function (res) {

            $("#buyCardModal").modal("hide");
            $scope.currentUser = res.data.model.user;
            $infoModal.open("Success");

        }, function (res) {
            $("#buyCardModal").modal("hide");
            $infoModal.open(res.data.message);
            setTimeout(function () {
                $location.url("monthly-stored-value");
            }, 2000)
        })

    };


    $scope.getListUserCards = function (level) {

        $scope.currentFilter = level;

        $http.get(base_api + "card/getUserCardLevels", {
            params: {
                level: level
            }
        }).then(function (res) {
            $scope.levels = res.data.model;
        });

    };
    $scope.setCurrentLevel = function (level) {
        $scope.selectedLevel = level;
    };

    $scope.setCurrentCard = function (card) {
        $scope.currentCard = card;
    };

    $scope.getCardLevels = function (item) {
        $scope.viewingLevel = item;
        $http.get(base_api + "card/cardLevels", {
            params: {
                card_id: item.card.id
            }
        }).then(function (res) {

            $scope.cardLevels = res.data.model;

        })
    };

});