gamingApp.directive("thumbnailSlider", function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initThumbSlider = function (element) {
                // provide any default options you want
                var defaultOptions = {};
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }

                defaultOptions.sliderId = element.attr("id");
                defaultOptions.before = function (currentIdx, nextIdx, manual) {
                    if (typeof scope.nsSlider != "undefined") scope.nsSlider.displaySlide(nextIdx);
                };
                // init carousel
                scope.thumbSlider =  new ThumbnailSlider(defaultOptions);

            };

            scope.destroy = function (element) {
                if(typeof scope.thumbSlider !== 'undefined')
                    scope.thumbSlider.init();
            };
            /**
             * Touch swipe
             */

            document.addEventListener('touchstart', handleTouchStart, false);
            document.addEventListener('touchmove', handleTouchMove, false);
            var xDown = null;
            var yDown = null;

            function handleTouchStart(evt) {
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
                        scope.nsSlider.next();

                    } else {
                        /* right swipe */
                        scope.nsSlider.prev();

                    }
                } else {
                    if ( yDiff > 0 ) {
                        /* up swipe */
                        scope.thumbSlider.next();
                    } else {
                        /* down swipe */
                        scope.thumbSlider.prev();
                    }
                }
                /* reset values */
                xDown = null;
                yDown = null;
            }
        }
    };
}).directive('thumbnailSliderItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {

            if(scope.$first){
                scope.destroy(element.closest('#thumbnail-slider'))
            }
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                setTimeout(function () {
                    scope.initThumbSlider(element.closest('#thumbnail-slider'));
                })

            }
        }
    };
}]);

