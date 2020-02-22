gamingApp.controller("mainController", function ($rootScope, $location, $scope, $route, $routeParams, $http, $infoModal, $uibModal, ConfigService, $timeout) {

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

    ConfigService.getConfig().then(function (config) {
        $rootScope.config = config;
        localStorage.base_api = config.base_api;
        localStorage.version = config.version;


        $http.get(localStorage.base_api + "setting/get", {params: {key: "_path"}}).then(function (res) {
            $rootScope.path = res.data;
        })
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

    $scope.login = function () {
        $http.post(localStorage.base_api + "user/signIn", JSON.stringify($scope.user)).then(function (res) {
            if (res.data.accessToken) {
                localStorage.uid = res.data.uid;
                localStorage.session_token = res.data.accessToken;
                $location.url("dashboard");
            } else {
                $infoModal.open("操作錯誤，請洽客服")
            }
        }, function (res) {
            if (res.data.status === 403) {
                $infoModal.open("帳戶狀態未啟用或停用中，請洽客服")
            } else {
                $infoModal.open("操作錯誤，請洽客服");
            }
        });

        return false;
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
    $scope.getListRoles = function () {
        $http.get(localStorage.base_api + "role/list").then(function (res) {
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