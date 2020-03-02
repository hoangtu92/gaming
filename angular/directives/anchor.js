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
}]);