gamingApp.controller("productController", function ($scope, $route, $http, $infoModal, $timeout) {


    /**
     * Products
     */

    $scope.getListProductCats = function () {
        $http.get(base_api + "product/categories").then(function (res) {
            $scope.productCats = res.data;
        });
    };

    $scope.getTagsClass = function (product) {
        return product.tags.reduce(function (t, e) {
            t.push(e.name);
            return t;
        }, []).join(" ");
    };


    $scope.setCurrentProduct = function (product) {

        $scope.$parent.currentProduct = product;

        $scope.openModal('product_info');

    };

    $scope.getProducts = function (cat_id) {

        $scope.currentFilter = cat_id;

        $http.get(base_api + "product/filter", {
            params: {
                cat_id: cat_id
            }
        }).then(function (res) {
            $scope.products = res.data.model;
        });
    };

});