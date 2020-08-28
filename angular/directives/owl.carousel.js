gamingApp.directive("owlCarousel", function () {
    return {
        restrict: 'E',
        transclude: false,
        compile: function compile(tElement, tAttrs, tTransclude) {

            var children = tElement.children();

            var template = angular.element('<div ng-repeat="item in items" ng-click="setActiveItem(item)" ng-class="{selected: activeItem.id == item.id}" class="slider-item"></div>');
            template.append(children);
            tElement.html(template);

            return function(scope, iElement, iAttrs, controller, $timeout) {

                scope.$on("before_load_item", function () {
                    iElement.owlCarousel('destroy');
                });

                scope.$on("fullscreenchange", function () {
                    iElement.owlCarousel('destroy');

                    setTimeout(function () {
                        //console.log(scope.owlOptions)
                        iElement.owlCarousel(scope.owlOptions);
                    }, 500)
                });

                scope.$on("after_load_item", function () {
                    setTimeout(function () {
                        //console.log(scope.owlOptions)
                        iElement.owlCarousel(scope.owlOptions);
                        iElement.trigger('next.owl.carousel');
                    }, 500)
                })

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