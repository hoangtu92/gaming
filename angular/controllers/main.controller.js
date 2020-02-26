gamingApp.controller("mainController", function ($rootScope, $location, $scope, $interval, $route, $routeParams, $http, $infoModal, $uibModal, ConfigService, $timeout) {

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

    $scope.$watch("user.phone", function (phone) {
        if(typeof phone === "undefined") return;
        if(phone.match(/^0/)){
            $scope.user.phone = phone.replace(/^0/, "");
        }
        /*if($scope.user.phone.length == $scope.validationRules[$scope.user.countryCode]){
            if($scope.validatePhone($scope.user.countryCode + $scope.user.phone)){

            }
        }*/
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
        var phone = $scope.user.countryCode + $scope.user.phone;
        if($scope.user.phone.length < $scope.validationRules[$scope.user.countryCode]){
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
        $http.get(base_api + "user/currentUser").then(function (res) {
            $scope.currentUser = res.data.model;
            if (cb) cb();
            $scope.$broadcast("user_loaded", $scope.currentUser);
        })
    };

    $scope.getListPrizes = function () {
        $http.get(base_api + "prize/list", {params: {uid: localStorage.uid}}).then(function (res) {
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

    $scope.setCurrentRole = function (role) {
        $scope.currentRole = role;
    };

    $scope.setCurrentVideo = function (video) {
        $scope.currentVideo = video;

    };
    $scope.setCurrentLevel = function (level) {
        $scope.selectedLevel = level;
    };


    $scope.getListPrizeLogs = function () {
        $http.get(base_api + "prize/logs", {params: {uid: localStorage.uid}}).then(function (res) {
            $scope.prizeLogs = res.data.model;
        })
    };

    $scope.buyProduct = function (product) {
        $http.get(base_api + "product/buy", {
            params: {product_id: product.id}
        }).then(function (res) {
            $scope.modal['product_buy'].close();
        })
    };
    $scope.buyVideo = function (video) {
        $http.get(base_api + "video/buy", {
            params: {video_id: video.id}
        }).then(function (res) {
            $scope.currentVideo = res.data.model;
            $scope.modal['video_buy'].close();
        })
    };

    $scope.enterGame = function (role) {
        $http.get(base_api + "game/obtainTicket", {
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



});