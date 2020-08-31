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

                function initCarousel(){

                    iElement.owlCarousel(scope.owlOptions);
                    var slider = iElement.find(".owl-stage-outer");

                    /**
                     * Touch swipe
                     */
                    slider[0].addEventListener('touchstart', handleTouchStart, false);
                    slider[0].addEventListener('touchmove', handleTouchMove, false);
                    slider[0].addEventListener('touchend', handleTouchEnd, false);
                    var xDown = null;
                    var yDown = null;

                    function handleTouchEnd() {
                        if(scope.direction === 'left'){
                            iElement.trigger('next.owl.carousel');
                        }
                        if(scope.direction === 'right'){
                            iElement.trigger('prev.owl.carousel');
                        }
                    }

                    function handleTouchStart(evt) {
                        scope.direction = false;
                        xDown = evt.touches[0].clientX;
                        yDown = evt.touches[0].clientY;
                    }

                    function handleTouchMove(evt) {
                        if ( ! xDown || ! yDown ) {
                            return;
                        }

                        var xUp = evt.touches[0].clientX;
                        var yUp = evt.touches[0].clientY;
                        var xDiff = xDown - xUp;
                        var yDiff = yDown - yUp;

                        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
                            if ( xDiff > 0 ) {
                                /* left swipe */
                                scope.direction = 'left';

                            } else {
                                /* right swipe */
                                scope.direction = 'right';

                            }
                        }
                        /* reset values */
                        xDown = null;
                        yDown = null;
                    }
                }

                scope.$on("before_load_item", function () {
                    iElement.owlCarousel('destroy');
                });

                scope.$on("fullscreenchange", function () {
                    iElement.owlCarousel('destroy');

                    setTimeout(function () {
                        //console.log(scope.owlOptions)
                        initCarousel()
                    }, 500)
                });

                scope.$on("after_load_item", function () {
                    setTimeout(function () {
                        //console.log(scope.owlOptions)
                        initCarousel()
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