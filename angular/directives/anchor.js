gamingApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.href === '#')
                elem.on('click', function(e){
                    e.preventDefault();
                });
        }
    };
}).directive('fileUpload', [function () {
    return {
        restrict: "A",
        link: function ($scope, element, attrs) {
            element.on('change', function (evt) {
                var files = evt.target.files;

                $scope.$emit("uploadFile", files);
                $scope.$apply();
            });
        }
    }
}]).directive("gamingForm", function () {
    return {
        restrict: "A",
        compile: function(element){
            angular.element(element).append(angular.element('<input type="hidden" name="data" value="">'));

            return function(scope, element, iAttrs, controller, $timeout) {
                scope.$on("payment_ready", function (evt, data) {
                    element[0].data.value = data;
                    element.submit();
                })
            }
        }
    }
});