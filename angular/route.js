gamingApp.config(function ($routeProvider) {
    /**
     * Route provider
     */
    $routeProvider
        .when('/login', {
            title: 'Login',
            view: 'login',
            layout: 'non-sidebar',
            templateUrl: 'views/login.htm?ver=' + config.version,
            controller: 'frontController',
            resolve: {
                'ConfigServiceData': function (ConfigService) {
                    // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                    return ConfigService.promise;
                }
            }
        })
        .when('/login/:action/:uid/:code', {
            title: 'Login',
            view: 'login',
            layout: 'non-sidebar',
            templateUrl: 'views/login.htm?ver=' + config.version,
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
            templateUrl: 'views/front.htm?ver=' + config.version,
            controller: 'frontController',
            resolve: {
                'ConfigServiceData': function (ConfigService) {
                    // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                    return ConfigService.promise;
                }
            }
        }).when('/dashboard/:msg?', {
        title: 'Dashboard',
        view: 'dashboard',
        layout: 'sidebar',
        templateUrl: 'views/dashboard.htm?ver=' + config.version,
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
        templateUrl: 'views/announcement.htm?ver=' + config.version,
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
        templateUrl: 'views/game.htm?ver=' + config.version,
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
        templateUrl: 'views/role-play.htm?ver=' + config.version,
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
        templateUrl: 'views/user-information.htm?ver=' + config.version,
        controller: 'userController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/monthly-stored-value/:msg?', {
        title: 'Monthly Stored Value',
        view: 'price_plan',
        layout: 'non-sidebar',
        templateUrl: 'views/price-plan.htm?ver=' + config.version,
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
        templateUrl: 'views/product.htm?ver=' + config.version,
        controller: 'productController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/shopping-cart', {
        title: 'Cart',
        view: 'shopping_cart',
        layout: 'non-sidebar',
        templateUrl: 'views/shopping_cart.htm?ver=' + config.version,
        controller: 'orderController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/checkout', {
        title: 'Checkout',
        view: 'checkout',
        layout: 'non-sidebar',
        templateUrl: 'views/checkout.htm?ver=' + config.version,
        controller: 'orderController',
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
        templateUrl: 'views/prize-redeem.htm?ver=' + config.version,
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
        bodyClass: 'uniform_maingame av-play',
        templateUrl: 'views/av-play.htm?ver=' + config.version,
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
        bodyClass: 'uniform_maingame av-play',
        templateUrl: 'views/av-short.htm?ver=' + config.version,
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
        bodyClass: 'uniform_maingame  av-play',
        templateUrl: 'views/my-av.htm?ver=' + config.version,
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
        templateUrl: 'views/card-buy.htm?ver=' + config.version,
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
        bodyClass: '',
        templateUrl: 'views/card-list.htm?ver=' + config.version,
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
        bodyClass: '',
        templateUrl: 'views/card-select.htm?ver=' + config.version,
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
        templateUrl: 'views/customer-service.htm?ver=' + config.version,
        controller: 'ticketController',
        resolve: {
            'ConfigServiceData': function (ConfigService) {
                // MyServiceData will also be injectable in your controller, if you don't want this you could create a new promise with the $q service
                return ConfigService.promise;
            }
        }
    }).when('/expenses-record', {
        title: 'Expenses Records',
        view: 'expenses_record',
        layout: 'non-sidebar',
        templateUrl: 'views/expenses-record.htm?ver=' + config.version,
        controller: 'userController',
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