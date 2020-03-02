gamingApp.config(function ($routeProvider) {
    /**
     * Route provider
     */
    $routeProvider
        .when('/login', {
            title: 'Login',
            view: 'login',
            layout: 'non-sidebar',
            templateUrl: 'views/login.htm',
            controller: 'frontController',
            resolve: {
                'ConfigServiceData': function (ConfigService) {
                    // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                    return ConfigService.promise;
                }
            }
        })
        .when('/login/:username/:code', {
            title: 'Login',
            view: 'login',
            layout: 'non-sidebar',
            templateUrl: 'views/login.htm',
            controller: 'userController',
            resolve: {
                'ConfigServiceData': function (ConfigService) {
                    // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                    return ConfigService.promise;
                }
            }
        })
        //Home Page
        .when('/', {
            title: 'Home',
            view: 'index',
            layout: 'non-sidebar',
            templateUrl: 'views/front.htm',
            controller: 'frontController',
            resolve: {
                'ConfigServiceData': function (ConfigService) {
                    // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                    return ConfigService.promise;
                }
            }
        }).when('/dashboard', {
        title: 'Dashboard',
        view: 'dashboard',
        layout: 'sidebar',
        templateUrl: 'views/dashboard.htm',
        controller: 'dashboardController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/announcement', {
        title: 'Announcement',
        view: 'announcement',
        layout: 'non-sidebar',
        templateUrl: 'views/announcement.htm',
        controller: 'announcementController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/role-game/:id', {
        title: 'Game',
        view: 'game',
        layout: 'non-sidebar',
        bodyClass: 'uniform_maingame',
        templateUrl: 'views/game.htm',
        controller: 'gameController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/role-play/:id', {
        title: 'Role Play',
        view: 'role_play',
        layout: 'non-sidebar',
        bodyClass: 'uniform_maingame av-play',
        templateUrl: 'views/role-play.htm',
        controller: 'roleController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/user-information', {
        title: 'User Information',
        view: 'user_information',
        layout: 'non-sidebar',
        templateUrl: 'views/user-information.htm',
        controller: 'userController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/monthly-stored-value', {
        title: 'Monthly Stored Value',
        view: 'price_plan',
        layout: 'non-sidebar',
        templateUrl: 'views/price-plan.htm',
        controller: 'pricePlanController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/mall', {
        title: 'Mall',
        view: 'mall',
        layout: 'non-sidebar',
        templateUrl: 'views/product.htm',
        controller: 'productController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/prize-redeem', {
        title: 'Prize redeem',
        view: 'prize_redeem',
        layout: 'non-sidebar',
        templateUrl: 'views/prize-redeem.htm',
        controller: 'prizeController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/av-play', {
        title: 'AV play',
        view: 'av_play',
        layout: 'non-sidebar',
        bodyClass: 'uniform_maingame uniformsister av-play',
        templateUrl: 'views/av-play.htm',
        controller: 'videoController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/av-short', {
        title: 'AV short',
        view: 'av_short',
        layout: 'non-sidebar',
        bodyClass: 'uniform_maingame uniformsister av-play',
        templateUrl: 'views/av-short.htm',
        controller: 'videoController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/my-av', {
        title: 'My AV',
        view: 'my_av',
        layout: 'non-sidebar',
        bodyClass: 'uniform_maingame uniformsister av-play',
        templateUrl: 'views/my-av.htm',
        controller: 'videoController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/card-buy', {
        title: 'Card Buy',
        view: 'card_buy',
        layout: 'non-sidebar',
        templateUrl: 'views/card-buy.htm',
        controller: 'cardController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/card-list', {
        title: 'Card List',
        view: 'card_list',
        layout: 'non-sidebar',
        bodyClass: 'uniformsister',
        templateUrl: 'views/card-list.htm',
        controller: 'cardController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/card-select', {
        title: 'Card Select',
        view: 'card_select',
        layout: 'non-sidebar',
        bodyClass: 'uniformsister',
        templateUrl: 'views/card-select.htm',
        controller: 'cardController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/customer-service', {
        title: 'Customer service',
        view: 'customer_service',
        layout: 'non-sidebar',
        templateUrl: 'views/customer-service.htm',
        controller: 'ticketController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).otherwise({
        redirectTo: '/dashboard'
    });
});