gamingApp.controller("mainController", function ($window, $rootScope, $location, $scope, $interval, $route, $routeParams, $http, $infoModal, $uibModal, $uibModalStack, ConfigService, $timeout) {

    $rootScope.route = $route;

    $scope.b64DecodeUnicode = function(str) {
        return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        }).join(''))
    };


    $scope.nsOptions =
        {
            sliderId: "ninja-slider",
            transitionType: "fade", //"fade", "slide", "zoom", "kenburns 1.2" or "none"
            autoAdvance: false,
            delay: "default",
            transitionSpeed: 700,
            aspectRatio: "2:1",
            initSliderByCallingInitFunc: false,
            shuffle: false,
            startSlideIndex: 0, //0-based
            navigateByTap: true,
            pauseOnHover: false,
            keyboardNav: true,
            license: "b2e981"
        };

    $scope.defaultOptions =
        {
            sliderId: "thumbnail-slider",
            orientation: "vertical",
            thumbWidth: "140px",
            thumbHeight: "70px",
            showMode: 2,
            autoAdvance: true,
            selectable: true,
            slideInterval: 3000,
            transitionSpeed: 900,
            shuffle: false,
            startSlideIndex: 0, //0-based
            pauseOnHover: true,
            initSliderByCallingInitFunc: false,
            rightGap: 0,
            keyboardNav: false,
            mousewheelNav: true,
            license: "b2e98"
        };


    $rootScope.ajaxLoading = false;

    $scope.$on("httpCallStarted", function () {
        $rootScope.ajaxLoading = true;
    });

    $scope.$on("httpCallStopped", function () {
        $rootScope.ajaxLoading = false;
    });

    $scope.$on('$locationChangeStart', function (e, destination, previous) {

        /*if(destination.match(/role-game/)){
            if(!previous.match(/dashboard/)){
                $location.url("dashboard")
            }
        }*/

        $scope.previousPage = previous;
        $scope.destinationPage = destination;

    });

    $scope.goBack = function () {
        if (typeof $scope.previousPage === 'undefined' || $scope.previousPage.length === 0 || $scope.previousPage === $scope.destinationPage) $location.url("dashboard");

        window.location.href = $scope.previousPage;
    };

    $scope.retrieveCartInfo = function (cartItems) {
        if (cartItems == null) return;
        $http.post(localStorage.base_api + "order/cartItems", JSON.stringify(cartItems)).then(function (res) {
            $scope.carts = res.data;
            $scope.$broadcast("cart_loaded", $scope.carts);
            $scope.cartTotals = $scope.carts.reduce(function (t, e) {
                t += e.qty;
                return t;
            }, 0);
            console.log("Cart", $scope.carts);
        })
    };


    $scope.$on('$locationChangeSuccess', function () {

        $scope.getCurrentUser();
        $scope.getCarts();
    });

    ConfigService.getConfig().then(function (config) {
        if (typeof localStorage.development !== 'undefined' && localStorage.development === "1") {
            config.base_api = "http://gaming.dev.ml-codesign.com:8080/api/";
            config.api_domain = "http://gaming.dev.ml-codesign.com:8080"
        }
        $rootScope.config = config;
        localStorage.base_api = config.base_api;
        localStorage.version = config.version;


        //Get path setting
        $http.get(localStorage.base_api + "setting/get", {params: {key: "_path"}}).then(function (res) {
            $rootScope.path = res.data;
        });


    });

    $scope.$on("cart_updated", function (e, cartItems) {
        $scope.retrieveCartInfo(cartItems);
        setCookie("cart", JSON.stringify(cartItems), 10);
    });

    $scope.getCarts = function () {
        if ($route.current.view === "login" || $route.current.view === "index") return;
        //get cart
        var cookie = getCookie("cart");
        $scope.cartItems = cookie !== "" ? JSON.parse(cookie) : {};

        if (typeof $scope.cartItems !== 'object' || $scope.cartItems == null) $scope.cartItems = {};

        $scope.retrieveCartInfo($scope.cartItems);
    };


    $scope.modal = {};
    $scope.user = {};

    $scope.openModal = function (modal, className, size) {

        if (typeof className === "undefined") className = "";
        if (typeof size === "undefined") size = "lg";

        if (typeof modal === 'undefined') return false;

        $scope.modal[modal] = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'includes/modals/' + modal + '.htm?ver=' + localStorage.version,
            backdropClass: modal + '_overlay',
            windowClass: modal + " " + className,
            size: size,
            scope: $scope
        });

        $scope.modal[modal].result.catch(function (res) {
            if (!(res === 'cancel' || res === 'escape key press')) {
                throw res;
            } else return 0;
        });

    };

    $scope.closeModal = function(){
        $uibModalStack.dismissAll();
    }
    $scope.goto = function (url) {
        $location.url(url);
    };

    $scope.broadcast = function (event, arg) {
        $scope.$broadcast(event, arg);
    };

    $scope.validationRules = {
        "+886": 9,
        "+86": 11,
        "+852": 8,
        "+853": 8,
        "+60": 9,
        "+63": 10
    };

    $scope.validatePhone = function (phone) {
        return phone.match(/\+8869\d{0,9}|\+86\d{0,11}|\+852\d{0,8}|\+853\d{0,8}|\+60\d{0,9}|\+63\d{0,10}/);
    };

    $scope.$watch("user.displayPhone", function (phone) {
        if (typeof phone === "undefined") return;

        if (phone.match(/^0/)) {
            $scope.user.phone = angular.copy(phone);
            $scope.user.displayPhone = phone.replace(/^0/, "");
        } else {
            $scope.user.phone = "0" + angular.copy(phone);
        }
    });

    $scope.login = function () {
        $http.post(localStorage.base_api + "user/signIn", JSON.stringify($scope.user)).then(function (res) {
            if (res.data.accessToken) {
                localStorage.uid = res.data.uid;
                localStorage.session_token = res.data.accessToken;

                $http.defaults.headers.common['Content-Type'] = 'application/json; charset=UTF-8';
                $http.defaults.headers.common['Authorization'] = "Bearer " + localStorage.session_token;

                localStorage.showWelcome = '1';

                $timeout(function () {
                    $location.url("dashboard");
                    $timeout(function () {
                        landScapeMode();
                    }, 500)
                })
            } else {
                $infoModal.open("此帳號尚未註冊，請先註冊")
            }
        }, function (res) {
            if (res.data.status === 403) {
                $infoModal.open("帳號或密碼錯誤，請重新輸入")
            }
        });

        return false;
    };

    $scope.cellUser = {};
    $scope.mailUser = {};

    $scope.cellSignUp = function () {
        var phone = $scope.user.countryCode + $scope.user.displayPhone;
        if ($scope.user.displayPhone.length < $scope.validationRules[$scope.user.countryCode]) {
            $infoModal.open("手機號碼格式錯誤，請輸入正確" + $scope.validationRules[$scope.user.countryCode] + "碼數字");
        } else if ($scope.validatePhone(phone)) {
            $http.post(localStorage.base_api + "user/signUp", JSON.stringify($scope.user)).then(function (res) {
                if (res.data.status) {
                    $scope.modal["cell_register"].close();
                    $scope.user = res.data.model;
                    $scope.openModal("verify_user", "", "md")
                }
            });
        } else {
            $infoModal.open("您輸入的手機號碼錯誤，請確認後重新輸入")
        }

    };
    $scope.verifyUser = function () {
        $http.post(localStorage.base_api + "user/verify", JSON.stringify({
            uid: $scope.user.uid,
            code: $scope.user.code
        })).then(function () {
            $infoModal.open("驗證成功，請登錄以繼續", function () {
                $location.url("login")
            });
        });
    };

    $scope.mailSignUp = function () {
        $http.post(localStorage.base_api + "user/signUp", JSON.stringify($scope.user)).then(function (res) {
            $scope.modal["mail_register"].close();
            $scope.user = res.data.model;

            $infoModal.open("Email驗證信已送出，請確認信箱")
        });

    };
    $scope.retryInterval = 0;
    $scope.resendSMS = function () {
        $scope.retryInterval = 60;
        $http.post(localStorage.base_api + "user/resend", JSON.stringify({
            username: $scope.user.username
        })).finally(function () {
            $scope.retryIntervalObj = $interval(function () {
                if ($scope.retryInterval === 0) {
                    $interval.cancel($scope.retryIntervalObj);
                } else {
                    $scope.retryInterval--;
                }

            }, 1000)
        });
    };

    $scope.requestForgetPWCode = function () {
        $http.get(localStorage.base_api + "user/requestForgetPWCode", {params: {u: $scope.user.username}}).then(function (value) {
            if(value.data.message === "phone"){
                $scope.user.uid = value.data.model.uid;
                $scope.openModal("change_password")
            }
            else{
                $infoModal.open("請至您的 mail 信箱收件並點選連結即可重設密碼");
            }
        });
    };

    $scope.changePassword = function () {
        $http.post(localStorage.base_api + "user/changePassword", JSON.stringify($scope.user)).then(function (value) {
            $scope.user = {};
            $scope.cancel();
            $infoModal.open("密碼修改成功，請登錄");
            $timeout(function () {
                $location.url("login");
            }, 3000)


        });
    };


    $scope.logout = function () {
        delete (localStorage.session_token);
        localStorage.showWelcome = '1';
        $location.url("login");
    };

    $scope.getRole = function () {
        $http.get(localStorage.base_api + "role/getRole", {params: {id: $routeParams.id}}).then(function (res) {
            $scope.currentRole = res.data.model;
            $scope.$broadcast("role_loaded", $scope.currentRole);
        });
    };

    $scope.getCurrentUser = function (cb) {
        if ($route.current.view === "login" || $route.current.view === "index") return;
        $http.get(localStorage.base_api + "user/currentUser").then(function (res) {
            $scope.currentUser = res.data.model;
            if (cb) cb();
            $scope.$broadcast("user_loaded", $scope.currentUser);
        })
    };

    $scope.getListPrizes = function () {
        $http.get(localStorage.base_api + "prize/list").then(function (res) {
            $scope.prizes = res.data.model;
        })
    };

    $scope.getListPricePlan = function () {
        $http.get(localStorage.base_api + "price-plan/list").then(function (res) {
            $scope.pricePlans = res.data;
        })
    };

    $scope.checkItemTags = function (item, tag) {
        if (typeof tag === 'undefined') return true;

        var tags = item.tags.reduce(function (t, e) {
            t.push(e.name);
            return t;
        }, []);

        return tags.indexOf(tag) >= 0;
    };

    /**
     * Role
     */

    $scope.request = {
        order: "latest",
        filter: "all"
    };
    $scope.getListRoles = function () {
        $scope.$broadcast("before_load_item");
        $scope.filter = {};
        switch($scope.request.filter){
            case "userStarted":
                $scope.filter.userStarted = true;
                break;
            case "userNotStarted":
                $scope.filter.userNotStarted = true;
                break;
            default:
                $scope.filter.all = true;
                break;
        }

        switch($scope.request.order){
            case "hottest":
                $scope.filter.hottest = true;
                break;
            case "oldest":
                $scope.filter.oldest = true;
                break;
            default:
                $scope.filter.latest = true;
                break;
        }

        $http.post(localStorage.base_api + "role/filter", JSON.stringify($scope.filter)).then(function (res) {
            $scope.$broadcast("after_load_item", res.data);
            $scope.items = res.data;
            $scope.currentRole = res.data[0];
        })
    };

    $scope.showAllLevels = true;
    $scope.showAll = function () {
        $scope.showAllLevels = true;
    };

    $scope.setCurrentRole = function (role) {
        $scope.currentRole = role;
    };

    $scope.setCurrentVideo = function (video) {
        $scope.currentVideo = video;

    };
    $scope.setCurrentLevel = function (level) {
        $scope.showAllLevels = false;
        $scope.selectedLevel = level;
    };
    $scope.setCurrentPool = function (pool) {
        $scope.currentPool = pool;
    };
    $scope.setCurrentCard = function (card) {
        $scope.currentCard = card;
    };

    $scope.getPaymentMethods = function(){
        $http.get(localStorage.base_api + "transactions/getPaymentMethods").then(function (value) {
            $scope.payment_methods = value.data;
        })
    };

    $scope.requestPlan = function (pricePlan) {
        $http.get(localStorage.base_api + "transactions/create", {params: {id: pricePlan.id, paymentMethod: pricePlan.paymentMethod}}).then(function (res) {
            $scope.$broadcast("payment_ready", res.data.model);
            $scope.modal['payment_method'].close();
        })
    };

    $scope.selectPlan = function (item) {

        if(item.type === 0 && $scope.currentUser.vip){
            $infoModal.open("您已經是VIP")
        }
        else{
            $scope.currentPlan = item;
            $scope.currentPlan.paymentMethod = "BNK82201";
            $scope.openModal('payment_method', '', 'md');
        }


    };

    $scope.getListPrizeLogs = function () {
        $http.get(localStorage.base_api + "prize/logs").then(function (res) {
            $scope.prizeLogs = res.data.model;
        })
    };


    $scope.addToCart = function (product) {

        if ($scope.cartItems[product.id] === 'undefined' || isNaN($scope.cartItems[product.id])) $scope.cartItems[product.id] = 0;

        $scope.cartItems[product.id]++;

        setCookie("cart", JSON.stringify($scope.cartItems), 10);

        $scope.getCarts();
        $scope.openModal("cart")

    };


    $scope.drawCard = function (pool) {
        $http.get(localStorage.base_api + "card/draw", {
            params: {id: pool.id}
        }).then(function (res) {
            $scope.modal['card_pool_buy'].close();
            $scope.luckyLevels = res.data.model;
            $scope.openModal("lucky_draw");
            $scope.getCurrentUser();

        })
    };

    $scope.buyCard = function (card) {

        $http.post(localStorage.base_api + "card/buy", JSON.stringify({
            id: card.id,
            token: ""
        })).then(function () {
            $location.url("card-list")
        }).finally(function () {
            $scope.modal["card_buy"].close();
        });

    };

    $scope.useCard = function (cardLevel) {
        $http.get(localStorage.base_api + "card/use", {
            params: {id: cardLevel.id}
        }).then(function () {
            $scope.modal['card_detail'].close();
            $scope.modal['user_cards'].close();
            $scope.getInUsedCards();
            $scope.getListUserCards();
        })
    };

    $scope.removeCard = function(cardLevel){
        $http.get(localStorage.base_api + "card/removeCard", {params: {id: cardLevel.id}}).then(function (value) {
            $scope.inUsedCardlevels = value.data;
        })
    };

    $scope.getListUserCards = function (level, cb) {

        $scope.currentFilter = level;

        $http.get(localStorage.base_api + "card/getUserCardLevels", {
            params: {
                level: level
            }
        }).then(function (res) {
            $scope.levels = res.data.model;
            if(cb) cb();
        });

    };

    $scope.$on("use_card", function (evt, cardLevel) {
        $scope.useCard(cardLevel);
    });
    $scope.$on("sell_card", function (evt, cardLevel) {
        $scope.sellCard(cardLevel);
    });
    $scope.$on("upgrade_card", function (evt, cardLevel) {
        $scope.upgradeCard(cardLevel);
    });

    $scope.upgradeCard = function(cardLevel){
        $http.get(localStorage.base_api + "card/upgrade", {
            params: {id: cardLevel.id}
        }).then(function (res) {

            $infoModal.open("恭喜您升級成功！", function () {
                $scope.openCardDetail(res.data.model);
            }, "確認", undefined, "", true);

            $scope.getListUserCards();

        });
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


    $scope.getCardLevels = function (item) {
        $scope.viewingLevel = item;
        $http.get(localStorage.base_api + "card/cardLevels", {
            params: {
                card_id: item.cardId
            }
        }).then(function (res) {

            $scope.cardLevels = res.data.model;

        })
    };

    $scope.getInUsedCards = function(){
        $http.get(localStorage.base_api + "card/getInUsedCards").then(function (res) {
            $scope.inUsedCardlevels = res.data.model;
        });
    };

    $scope.openCardDetail = function(item){
        if(typeof $scope.modal['card_detail'] !== "undefined")
            $scope.modal['card_detail'].dismiss();

        $scope.getCardLevels(item);
        $scope.openModal('card_detail');
    };

    $scope.selectCard = function(){
        $scope.openModal("user_cards")
    };

    $scope.cardConfiguration = function(cb){
        $scope.getListUserCards(null, function () {
            if($scope.levels.length > 0)
                $scope.openModal("card_select", "fullwidth");
            else{
                if(cb) cb();
            }
        });

    };


    $scope.playGame = function(){

        $http.get(localStorage.base_api + "game/checkTicket", {params: {roleId: $scope.currentRole.id}}).then(function (res) {
            $scope.cardConfiguration(function () {
                $scope.goto('role-game/' + $scope.currentRole.id);
            });
        },function (reason) {
            $scope.openModal('enter_game')
        });
    };

    $scope.saveAndEnterGame = function(){
        $infoModal.open("配置成功");
        $timeout(function () {
            $scope.goto('role-game/' + $scope.currentRole.id);
        }, 2000)

    };

    $scope.enterGame = function () {
        $http.get(localStorage.base_api + "game/obtainTicket", {
            params: {roleId: $scope.currentRole.id}
        }).then(function (res) {
            $scope.modal['enter_game'].close();
            $scope.$broadcast("ticketObtained", res.data);

            $scope.cardConfiguration(function () {
                $scope.goto('role-game/' + $scope.currentRole.id);
            });
        })
    };


    $scope.playVideo = function () {

        if ($scope.videoPlayer.src !== '') {
            $scope.$broadcast("playVideo");
        } else {
            $http.get(localStorage.base_api + "video/getPlayableUrl", {params: {id: $scope.currentVideo.id}}).then(function (res) {
                $scope.$broadcast("playVideo", $scope.path['video'] + res.data.model)
            }, function (reason) {
                if(reason.status === 406)
                    $scope.openModal("video_buy")
            })
        }

    };

    $scope.buyVideo = function () {

        $http.get(localStorage.base_api + "video/buy", {
            params: {video_id: $scope.currentVideo.id}
        }).then(function () {
            $scope.modal['video_buy'].close();
            $scope.playVideo();

            $scope.getCurrentUser();

        })
    };

    $scope.$on("videoPlay", function (e, elem) {
        //console.log("Angular event: Play", elem);
        $scope.currentVideo.playing = true;
        $scope.$apply();
    });

    $scope.$on("videoBegin", function (e, elem) {
        $scope.currentVideo.playing = false;
        $scope.videoPlayer = elem[0];
    });

    $scope.$on("videoPause", function (e, elem) {
        //console.log("Angular event: Pause", elem);
        $scope.currentVideo.playing = false;
        $scope.$apply();
    });

    $scope.$on("videoLoading", function (e, elem) {
        //console.log("Angular event: Loading", elem);
        $scope.currentVideo.showLoading = true;
        $scope.$apply();
    });

    $scope.$on("videoLoaded", function (e, elem) {
        //console.log("Angular event: Loaded", elem);
        $scope.currentVideo.showLoading = false;
        $scope.$apply();
    });

    $scope.getCurrentUserVideos = function (tag) {
        $scope.currentFilter = tag;
        $http.get(localStorage.base_api + "video/getUserVideos", {
            params: {
                tagName: tag
            }
        }).then(function (res) {
            $scope.userVideos = res.data.model;
            $scope.userVideosID = res.data.model.map(function (value) {
                return value.id;
            });
            console.log($scope.userVideos)
        })
    };

    $scope.getVideos = function (cat, tag) {
        $scope.videos = [];
        $scope.currentFilter = tag;

        $http.get(localStorage.base_api + "video/filter", {
            params: {
                tagName: tag,
                catName: cat
            }
        }).then(function (res) {
            $scope.videos = res.data.model;

        });
    };


    //Close the game when user close tab
    window.addEventListener('beforeunload', function (e) {
        $scope.$broadcast("close_window", e);
        //e.preventDefault();
        //e.returnValue = "";

    });

    var loadingProgress;
    var INACTIVITY_TO_PROPOSE_RELOAD = 5000;

    $scope.applicationLoaded = false;
    $scope.requestsCounter = 0;
    $scope.responsesCounter = 0;
    $scope.proposeReload = false;

    function resetWaitingTime() {
        if (loadingProgress) {
            $timeout.cancel(loadingProgress);
        }
        loadingProgress = $timeout(function () {
            $scope.proposeReload = true;
        }, INACTIVITY_TO_PROPOSE_RELOAD);
    }

    $scope.reload = function () {
        $window.location.reload();
    };

    $scope.$on('application_loaded', function () {
        $scope.applicationLoaded = true;
    });

    $scope.$on('application_loading', function (event, counts) {
        resetWaitingTime();
        $scope.requestsCounter = counts.requests;
        $scope.responsesCounter = counts.responses;
    });


});