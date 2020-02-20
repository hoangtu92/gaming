gamingApp.controller("productController", function ($scope, $route, $http, $infoModal, $timeout) {


    /**
     * Products
     */
    $scope.getListProductTags = function () {
        $http.get(base_api + "product/tags").then(function (res) {
            $scope.productTags = res.data;
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

    $scope.getProducts = function (tag) {

        $scope.currentFilter = tag;

        $http.get(base_api + "product/filter", {
            params: {
                tagName: tag
            }
        }).then(function (res) {
            $scope.products = res.data.model;
        });
    };

});