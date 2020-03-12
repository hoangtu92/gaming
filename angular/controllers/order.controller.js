gamingApp.controller("orderController", function ($scope, $route, $http, $infoModal, $timeout, $location) {

    $scope.order = {country: "Taiwan", shippingFee: 0};

    $scope.updateCart = function () {
        var cartItems = $scope.$parent.carts.reduce(function (t, e) {
            if(typeof t[e.id] === 'undefined') t[e.id] = 0;
            t[e.id] = e.qty;
            return t;
        }, {});

        $scope.$emit("cart_updated", cartItems);

    };

    $scope.getCountries = function(){
        $http.get("/assets/countries.json").then(function (value) {
            $scope.countries = value.data;
        });
    };

    $scope.getShippingFee = function(){
        $http.get(localStorage.base_api + "order/getShippingFee").then(function (res) {
            $scope.order.shippingFee = res.data;
        })
    };

    $scope.deleteItem = function (item) {
        var cartItems = $scope.$parent.cartItems;
        delete(cartItems[item.id]);
        $scope.$emit("cart_updated", cartItems);
    };

    $scope.$on("cart_loaded", function (e, carts) {
        $scope.order.cartTotal = carts.reduce(function (t ,e) {
            t += e.price*e.qty;
            return t;
        }, 0);
    });


    $scope.placeOrder = function () {
        $scope.order.carts = $scope.$parent.cartItems;
        console.log("ORDER: ", $scope.order);

        $http.post(localStorage.base_api + "order/checkout", JSON.stringify($scope.order)).then(function (res) {
            setCookie("cart", null);
            $infoModal.open("訂單已成功下達，將在幾天內交付給您");
            $timeout(function () {
                $location.url("dashboard");
            }, 2000)
        })
    }


});