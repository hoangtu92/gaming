gamingApp.controller("mainController", function ($window, $rootScope, $location, $scope, $interval, $route, $routeParams, $http, $infoModal, $uibModal, ConfigService, $timeout) {

    $rootScope.route = $route;


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

    $scope.$on('$locationChangeStart', function (e, destination, previous) {

        if(destination.match(/role-game/)){
            if(!previous.match(/dashboard/)){
                $location.url("dashboard")
            }
        }

    });
    $scope.$on('$locationChangeSuccess', function () {
        $scope.getCurrentUser();
    });

    ConfigService.getConfig().then(function (config) {
        $rootScope.config = config;
        localStorage.base_api = config.base_api;
        localStorage.version = config.version;


        $http.get(localStorage.base_api + "setting/get", {params: {key: "_path"}}).then(function (res) {
            $rootScope.path = res.data;

        });

    });


    $scope.modal = {};
    $scope.user = {};

    $scope.openModal = function (modal, className) {

        if(typeof className === "undefined") className = "";

        if (typeof modal === 'undefined') return false;

        $scope.modal[modal] = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title-top',
            ariaDescribedBy: 'modal-body-top',
            templateUrl: 'includes/modals/' + modal + '.htm',
            backdropClass: modal + '_overlay',
            windowClass: modal + " " + className,
            size: 'lg',
            scope: $scope
        });

        $scope.modal[modal].result.catch(function (res) {
            if (!(res === 'cancel' || res === 'escape key press')) {
                throw res;
            } else return 0;
        });

    };

    $scope.goto = function (url) {
        $location.url(url);
    };

    $scope.broadcast = function(event, arg){
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

    $scope.validatePhone = function(phone){
        return phone.match(/\+8869\d{0,9}|\+86\d{0,11}|\+852\d{0,8}|\+853\d{0,8}|\+60\d{0,9}|\+63\d{0,10}/);
    };

    $scope.$watch("user.displayPhone", function (phone) {
        if(typeof phone === "undefined") return;

        if(phone.match(/^0/)){
            $scope.user.phone = angular.copy(phone);
            $scope.user.displayPhone = phone.replace(/^0/, "");
        }
        else{
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

                $timeout(function () {
                    $location.url("dashboard");
                })
            } else {
                $infoModal.open("此帳號尚未註冊，請先註冊")
            }
        }, function (res) {
            if (res.data.status === 403) {
                $infoModal.open("帳號或密碼錯誤，請重新輸入")
            } else {
                $infoModal.open("此帳號尚未註冊，請先註冊");
            }
        });

        return false;
    };

    $scope.cellUser = {};
    $scope.mailUser = {};

    $scope.cellSignUp = function(){
        var phone = $scope.user.countryCode + $scope.user.displayPhone;
        if($scope.user.displayPhone.length < $scope.validationRules[$scope.user.countryCode]){
            $infoModal.open("手機號碼格式錯誤，請輸入正確" +$scope.validationRules[$scope.user.countryCode]+ "碼數字");
        }
        else if($scope.validatePhone(phone)){
            $http.post(localStorage.base_api + "user/signUp", JSON.stringify($scope.user)).then(function (res) {
                if(res.data.status){
                    $scope.modal["cell_register"].close();
                    $scope.openModal("verify_user")
                }
            });
        }
        else{
            $infoModal.open("您輸入的手機號碼錯誤，請確認後重新輸入")
        }

    };
    $scope.verifyUser = function(){
        var username = $scope.user.phone === null ? $scope.user.email : $scope.user.phone;
        $http.post(localStorage.base_api + "user/verify", JSON.stringify({
            username: username,
            code: $scope.user.code
        })).then(function () {
            $infoModal.open("驗證成功，請登錄以繼續", function () {
                window.location.reload();
            });
        });
    };

    $scope.mailSignUp = function(){
        $http.post(localStorage.base_api + "user/signUp", JSON.stringify($scope.user)).then(function (res) {
            $scope.modal["mail_register"].close();
            $infoModal.open("Email驗證信已送出，請確認信箱")
        });
    };
    $scope.retryInterval =0;
    $scope.resendSMS = function(){
        $scope.retryInterval = 60;
        $http.post(localStorage.base_api + "user/resend", JSON.stringify({
            username: $scope.user.username
        })).finally(function () {
            $scope.retryIntervalObj = $interval(function () {
                if($scope.retryInterval === 0) {
                    $interval.cancel($scope.retryIntervalObj);
                }
                else{
                    $scope.retryInterval--;
                }

            }, 1000)
        });
    };

    $scope.requestForgetPWCode = function(){
        $http.get(localStorage.base_api + "user/requestForgetPWCode", {params: {u: $scope.user.username}}).then(function (value) {
            $scope.openModal("change_password")
        });
    };

    $scope.changePassword = function(){
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
        $location.url("login");
    };

    $scope.getRole = function () {
        $http.get(localStorage.base_api + "role/getRole", {params: {id: $routeParams.id}}).then(function (res) {
            $scope.currentRole = res.data.model;
            $scope.$broadcast("role_loaded", $scope.currentRole);
        });
    };

    $scope.getCurrentUser = function (cb) {
        if($route.current.view === "login" || $route.current.view === "index") return;
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

    $scope.filter = {};
    $scope.getListRoles = function () {
        $http.post(localStorage.base_api + "role/filter", JSON.stringify($scope.filter)).then(function (res) {
            $scope.roles = res.data;
            $scope.currentRole = $scope.roles[0];
        })
    };

    $scope.showAllLevels = true;
    $scope.showAll = function(){
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


    $scope.getListPrizeLogs = function () {
        $http.get(localStorage.base_api + "prize/logs").then(function (res) {
            $scope.prizeLogs = res.data.model;
        })
    };

    $scope.buyProduct = function (product) {
        $http.get(localStorage.base_api + "product/buy", {
            params: {product_id: product.id}
        }).then(function (res) {
            $scope.modal['product_buy'].close();
        })
    };
    $scope.drawCard = function (pool) {
        $http.get(localStorage.base_api + "card/draw", {
            params: {id: pool.id}
        }).then(function (res) {
            $scope.modal['card_pool_buy'].close();
            $scope.luckyLevels = res.data.model;
            $scope.openModal("lucky_draw");

        })
    };

    $scope.buyCard = function (card) {

        $http.post(base_api + "card/buy", JSON.stringify({
            id: card.id,
            token: ""
        })).then(function () {
            $location.url("card-list")
        }).finally(function () {
            $scope.modal["card_buy"].close();
        });

    };






    $scope.getCardLevels = function (item) {
        $scope.$parent.viewingLevel = item;
        $http.get(base_api + "card/cardLevels", {
            params: {
                card_id: item.cardId
            }
        }).then(function (res) {

            $scope.$parent.cardLevels = res.data.model;

        })
    };

    $scope.playVideo = function(){

        if($scope.videoPlayer.src !== ''){
            $scope.$broadcast("playVideo");
        }
        else{
            $http.get(localStorage.base_api + "video/getPlayableUrl", {params: {id: $scope.currentVideo.id}}).then(function (res) {
                $scope.$broadcast("playVideo", $scope.path['video'] + res.data.model)
            }, function (reason) {
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

    $scope.getCurrentUserVideos = function(tag){
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

        $http.get(base_api + "video/filter", {
            params: {
                tagName: tag,
                catName: cat
            }
        }).then(function (res) {
            $scope.videos = res.data.model;

        });
    };

    $scope.enterGame = function (role) {
        $http.get(localStorage.base_api + "game/obtainTicket", {
            params: {roleId: role.id}
        }).then(function (res) {
            $scope.modal['enter_game'].close();
            $scope.$broadcast("ticketObtained", res.data)

        }).finally(function () {
            $location.url("role-game/" + role.id)
        })
    };


    //Close the game when user close tab
    window.addEventListener('beforeunload', function (e) {

        $scope.$broadcast("close_window", e);

    });

    var loadingProgress;
    var INACTIVITY_TO_PROPOSE_RELOAD = 5000;

    $scope.applicationLoaded = false;
    $scope.requestsCounter = 0;
    $scope.responsesCounter = 0;
    $scope.proposeReload = false;

    function resetWaitingTime () {
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