gamingApp.directive("owlCarousel", function () {
    return {
        restrict: 'E',
        transclude: false,
        compile: function compile(tElement, tAttrs, tTransclude) {

            var children = tElement.children();

            var template = angular.element('<div ng-repeat="item in roles" class="slider-item"></div>');
            template.append(children);
            tElement.html(template);

            return function(scope, iElement, iAttrs, controller, $timeout) {

                scope.$on("request_list_role", function () {
                    iElement.owlCarousel('destroy');

                });
                scope.$on("list_role_loaded", function () {

                    setTimeout(function () {
                        iElement.owlCarousel(scope.carouselOptions);
                    }, 500)
                });

            }
        }
    };
}).directive('owlCarouselItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {
            if(scope.$first) {
                //scope.destroyCarousel(element.parent())
            }
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                //scope.initCarousel(element.parent());
            }
        }
    };
}]);