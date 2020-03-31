gamingApp.controller("gameController", function ($scope, $route, $routeParams, $http, $location, $infoModal, $timeout) {

    /**
     * Sic bo dice game
     */

    $scope.dices = {
        1: "/assets/images/onered_box.png",
        2: "/assets/images/twoblack_box.png",
        3: "/assets/images/threeblack_box.png",
        4: "/assets/images/fourred_box.png",
        5: "/assets/images/fiveblack_box.png",
        6: "/assets/images/sixblack_box.png"
    };




    function getAllBets(){

        var bets = [];

        if($scope.gaming.score_4 > 0){
            bets.push("score_4");
        }
        if($scope.gaming.score_5 > 0){
            bets.push("score_5");
        }

        if($scope.gaming.score_6 > 0){
            bets.push("score_6");
        }

        if($scope.gaming.score_7 > 0){
            bets.push("score_7");
        }

        if($scope.gaming.score_8 > 0){
            bets.push("score_8");
        }

        if($scope.gaming.score_9 > 0){
            bets.push("score_9");
        }

        if($scope.gaming.score_10 > 0){
            bets.push("score_10");
        }

        if($scope.gaming.score_11 > 0){
            bets.push("score_11");
        }

        if($scope.gaming.score_12 > 0){
            bets.push("score_12");
        }

        if($scope.gaming.score_13 > 0){
            bets.push("score_13");
        }

        if($scope.gaming.score_14 > 0){
            bets.push("score_14");
        }

        if($scope.gaming.score_15 > 0){
            bets.push("score_15");
        }

        if($scope.gaming.score_16 > 0){
            bets.push("score_16");
        }
        if($scope.gaming.score_17 > 0){
            bets.push("score_17");
        }
        //check big bet
        if($scope.gaming.big > 0){
            bets.push("big");
        }

        //check small bet
        if($scope.gaming.small > 0){
            bets.push("small");
        }

        //check single bet
        if($scope.gaming.dice_1 > 0){
            bets.push("dice_1");
        }

        if($scope.gaming.dice_2 > 0){
            bets.push("dice_2");
        }

        if($scope.gaming.dice_3 > 0){
            bets.push("dice_3");
        }

        if($scope.gaming.dice_4 > 0){
            bets.push("dice_4");
        }

        if($scope.gaming.dice_5 > 0){
            bets.push("dice_5");
        }

        if($scope.gaming.dice_6 > 0){
            bets.push("dice_6");
        }

        //check triple bet
        if($scope.gaming.triple_1 > 0){
            bets.push("triple_1");
        }

        if($scope.gaming.triple_2 > 0){
            bets.push("triple_2");
        }

        if($scope.gaming.triple_3 > 0){
            bets.push("triple_3");
        }

        if($scope.gaming.triple_4 > 0){
            bets.push("triple_4");
        }

        if($scope.gaming.triple_5 > 0){
            bets.push("triple_5");
        }

        if($scope.gaming.triple_6 > 0){
            bets.push("triple_6");
        }

        //check any triple bet
        if($scope.gaming.any_triple > 0){
            bets.push("any_triple");
        }

        return bets;
    }

    /**
     * get game ratio
     */
    $scope.getRatios = function(){
      $http.get(localStorage.base_api + "game/getRatios").then(function (res) {
            $scope.ratio = res.data;
      })
    };

    /**
     * Get bet units
     */
    $scope.getBetUnits = function(){
      $http.get(localStorage.base_api + "game/getBetUnits").then(function (res) {
            $scope.units = res.data;
            $scope.getInUsedCards();
      })
    };

    /**
     * Restore all bets by its value
     */
    $scope.restoreGame = function () {

        if(typeof $scope.gaming === 'undefined') return;

        var bets = getAllBets();


        $timeout(function () {
            bets.forEach(function (o, i) {
                $scope.drawIcon(document.querySelector('[data-bet="'+o+'"]'));
            });
        }, 500);
    };

    /**
     * Double all current bet on table
     */
    $scope.cloneBet = function(){
        if(typeof $scope.gaming === "undefined") return;

        var bets = getAllBets();

        bets.forEach(function (o) {
            $scope.gaming[o] = $scope.gaming[o] * 2;
        });

        $scope.restoreGame();

    };

    /**
     * Save current bet to the local machine
     */
    $scope.saveBet = function(){

        if(typeof $scope.gaming === 'undefined'){
            $location.url("dashboard");
            return false;
        }

        var bets = getAllBets();
        var gamingSession = {};
        bets.forEach(function (value) {
            gamingSession[value] = $scope.gaming[value];
        });
        localStorage["game_session_" + $scope.gaming.id] = JSON.stringify(gamingSession);
    };

    $scope.buyMoreBet = function(){

        if($scope.gaming.availableBet >= $scope.units.bet_1){
            $infoModal.open("剩餘籌碼不足，請先結束此局");
            return;
        }

        var creditNeed = $scope.gaming.total - $scope.gaming.betQuota;
        $scope.buyMoreBetModal = $infoModal.open("您的籌碼不足，您尚有" + $scope.currentUser.credit.formatPrice() + "G幣，<br>是否要花費" + $scope.currentRole.betQuotaFee.formatPrice() + "G幣 兌換" + $scope.currentRole.betQuota.formatPrice() + "點籌碼", function () {
            var vm = this;
            $http.post(localStorage.base_api + "game/requestBets").then(function (res) {
                $scope.gaming = res.data;
                $scope.restoreGame();
                $scope.getCurrentUser(function () {
                    vm.close()
                });

            })
        }, "確定").result.then(function (value) {
            //console.log("Closure")
        }, function (reason) {
            //console.log("Dismiss");
            angular.element(".bet-icon").remove();
            $scope.initGame();
        });
    };



    /**
     * Restore bets from local machine
     */
    $scope.applySavedBets = function(){

        if(typeof $scope.gaming === 'undefined'){
            $location.url("dashboard");
            return false;
        }

        if(typeof localStorage["game_session_" + $scope.gaming.id] === "undefined") return;

        var gamingSession = JSON.parse(localStorage["game_session_" + $scope.gaming.id]);

        if(gamingSession){
            for(var i in gamingSession){
                if(gamingSession.hasOwnProperty(i)){
                    $scope.gaming[i] += gamingSession[i];
                }
            }

            $http.post(localStorage.base_api + "game/updateGame", JSON.stringify($scope.gaming)).then(function (res) {
                $scope.gaming = res.data.model;
                $scope.restoreGame();
            }, function (reason) {
                $scope.gaming = reason.data.model;
                if(reason.status === 406){
                    $scope.buyMoreBet()
                }
            });

        }
    };

    $scope.resetGameState = function(){
        angular.element(".dices-result-container").hide();
        angular.element(".win").removeClass("win");
        angular.element(".lost").removeClass("lost");
        $(".gain-point").removeClass("active");
    };

    //Select bet amount
    $scope.selectBet = function (amount) {
        $scope.selectedBet = amount;
        $scope.resetGameState();

    };

    /**
     *
     * @param el
     * @param amount
     * @returns {boolean}
     */
    $scope.placeBet = function (el, amount) {


        if(typeof $scope.gaming === 'undefined'){
            $location.url("dashboard");
            return false;
        }

        $scope.resetGameState();

        //Check bet unit is selected
        if (isNaN(amount)) {
            $infoModal.open("請先選擇壓注籌碼");
            return false;
        }
        amount = parseInt(amount);

        //Get bet area key
        var bet_area = el.getAttribute('data-bet');

        //Initialize bet are amount 0
        if (typeof $scope.gaming[bet_area] === 'undefined') $scope.gaming[bet_area] = 0;

        $scope.gaming[bet_area] = parseInt($scope.gaming[bet_area]);

        //console.log($scope.gaming[bet_area], amount)

        $scope.gaming[bet_area] +=  amount;



        //Placing bet
        $http.post(localStorage.base_api + "game/updateGame", JSON.stringify($scope.gaming)).then(function (res) {
            if (res.data.status) {

                //New gaming model with updated bet value and user credit
                $scope.gaming = res.data.model;

                //place the icon
                $scope.drawIcon(el);

                //console.log($scope.gaming);

            }
        }, function (res) {
            $scope.gaming = res.data.model;
            if(res.status === 406){
                $scope.buyMoreBet()
            }
            else if(res.status === 400){

            }
        });

        return true;

    };


    /**
     * Draw icon on screen
     * @param area
     */
    $scope.drawIcon = function(area){

        //Get position of element
        var pos = area.getBoundingClientRect(),
            bet_area = area.getAttribute('data-bet');

        //Remove exists pos&element
        angular.element("." + bet_area).remove();

        //Calculate the bet amount and display in web
        var result = $scope.gaming[bet_area] / 1000,
            style = 'display: none; position: fixed; left: ' + pos.x + 'px; top: ' + pos.y + 'px;',
            icon = '<div class="bet-icon redvlack_circle ' + bet_area + '" style="' + style + '">\n' +
                '                                    <img src="/assets/images/redblackbgr.png">\n' +
                '                                    <div class="text">' + result + 'K</div>\n' +
                '                                </div>';

        var html = angular.element(icon);

        //Insert to document
        angular.element('body .gamepage').append(html);

        html.show();
        $timeout(function () {

        }, 300);
    };


    /**
     * Check ticket available
     */
    $scope.initGame = function () {
        $http.get(localStorage.base_api + "game/checkTicket", {params: {roleId: $routeParams.id}}).then(function (res) {
            $scope.gaming = res.data.model;
            $http.defaults.headers.common['Session-ID'] = $scope.gaming.id;

            if(localStorage.showWelcome === '1'){
                $infoModal.open("親愛的<br>" +
                    "歡迎回來<br>" +
                    "今天也要加油<br>" +
                    "把我脫光喔!")
            }

            localStorage.showWelcome = '0';

            if($scope.gaming.betQuota > $scope.currentRole.maxThreshold){
                $scope.gaming.betQuota = $scope.currentRole.maxThreshold;
            }

            $scope.restoreGame();
        },function (reason) {
            if(reason.status === 423){
                $scope.openModal("enter_game");
                $scope.modal['enter_game'].result(function () {

                }, function () {
                    $location.url("dashboard");
                })
            }
        })
    };


    /**
     * Reset game
     */
    $scope.resetGame = function () {

        $http.get(localStorage.base_api + "game/resetGame").then(function (res) {
            $scope.gaming = res.data.model;
            angular.element(".bet-icon").remove();
            $scope.resetGameState();
        }, function (reason) {
            if(reason.status === 423){
                $scope.openModal("enter_game")
            }
        });

    };

    /**
     * Exit current game
     */
    $scope.exitGame = function(){
        $infoModal.open("請愛的<br>" +
            "你確定要離開，不再陪我玩一下嗎?", function () {
            $scope.closeModal()
        } , "再玩一下", function () {
            $scope.closeSession()
        }, "確定");

    };

    $scope.closeSession = function(){
        $http.get(localStorage.base_api + "game/closeSession").finally(function () {
            $location.url("dashboard");
        })
    };


    /**
     * Open game result
     */
    $scope.startGame = function () {

        $scope.resetGameState();

        $http.post(localStorage.base_api + "game/shake").then(function (res) {

            $scope.gaming = res.data.model;

            console.log($scope.gaming);

            var win = Object.keys($scope.gaming['win']),
                lost = Object.keys($scope.gaming['lost']);

            for(var i in win){
                if(win.hasOwnProperty(i)){
                    angular.element('[data-bet="'+win[i]+'"]').addClass("win");
                    angular.element("." + win[i]).addClass("win");
                }
            }
            for(var i in lost){
                if(lost.hasOwnProperty(i)){
                    angular.element('[data-bet="'+lost[i]+'"]').addClass("lost");
                    angular.element("." + lost[i]).addClass("lost");
                }
            }

            if($scope.gaming.gain > 0){
                $(".gain-point").addClass("active");
            }

            angular.element(".dices-result-container").show();


            $scope.hasUnsavedChange = false;
        }, function (reason) {
            if(reason.status === 423){
                $scope.openModal("enter_game")
            }
            else if(reason.status === 406){
                $scope.buyMoreBet()
            }
        });
    };

    /**
     * Click event on area
     */
    angular.element(".bet-area").each(function (i, o) {
        o.onclick = function () {
            $scope.placeBet(o, $scope.selectedBet);
            $scope.$apply();
        }
    });

    //Re draw icon when window resize, scroll
    window.addEventListener("resize", function (e) {
        $scope.restoreGame();
    });

    window.addEventListener("scroll", function (e) {
        $scope.restoreGame();
    });

    $scope.$on("ticketObtained", function (evt, value) {
        $scope.initGame();
    });



    $scope.$on("close_window", function (evt, e) {

        var xhttp = new XMLHttpRequest();

        xhttp.open("GET", localStorage.base_api + "game/closeSession", false);
        xhttp.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        xhttp.setRequestHeader("Authorization", "Bearer " + localStorage.session_token);
        xhttp.setRequestHeader("Session-ID", $scope.gaming.id);
        xhttp.send();

    })

});