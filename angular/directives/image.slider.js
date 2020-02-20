gamingApp.directive("imageSlider", function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initImgSlider = function (element) {
                // provide any default options you want
                var defaultOptions = {};
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }

                defaultOptions.sliderId = element.attr("id");

                defaultOptions.before = function (currentIdx, nextIdx, manual) {
                    if (manual && typeof scope.thumbSlider != "undefined") scope.thumbSlider.display(nextIdx);
                };

                // init carousel
                scope.nsSlider =  new NinjaSlider(defaultOptions);

            };

            scope.destroy = function (element) {
                if(typeof scope.nsSlider !== 'undefined')
                    scope.nsSlider.init();
            }
        }
    };
}).directive('imageSliderItem', [function () {
    return {
        restrict: 'A',
        transclude: false,
        link: function (scope, element) {

            if(scope.$first){
                scope.destroy(element.closest("#ninja-slider"))
            }
            // wait for the last item in the ng-repeat then call init
            if (scope.$last) {
                setTimeout(function () {
                    scope.initImgSlider(element.closest("#ninja-slider"));
                })
            }
        }
    };
}]);

