gamingApp.directive('lazyScroll',[function() {
    function link($scope, elem, attr) {
        var lazyElems = document.querySelectorAll('img[lazy-src]')
            ,   scrollStart = 0;

        var updateChildTimeout;
        $scope.$on('lazyScroll:childUpdate', function() {
            clearTimeout(updateChildTimeout);
            updateChildTimeout = setTimeout(function() {
                lazyElems = document.querySelectorAll('img[lazy-src]');
            }, 300);
        });

        elem.on('scroll', function() {
            scrollStart = elem[0].scrollTop;

            if (lazyElems.length) {
                for (var i = 0; i < lazyElems.length; i++) {
                    var lazyElem = angular.element(lazyElems[i]);
                    if (((elem[0].getBoundingClientRect().top - lazyElem[0].getBoundingClientRect().top) + scrollStart) < (scrollStart + elem[0].getBoundingClientRect().height) && !lazyElem.hasClass('lazy-done')) {
                        var src = lazyElem.attr('lazy-src');
                        lazyElem.removeAttr('lazy-src');

                        lazyElem.attr('src', src);
                        lazyElem.addClass('lazy-done');
                    }
                }
            }
        });
    }

    return {
        restrict: 'C',
        link: link
    }
}]);

gamingApp.directive('lazySrc', ['$timeout', function($timeout) {
    function link($scope, elem, attr) {
        function findAncestor (el, cls) {
            while ((el = el.parentElement) && !el.classList.contains(cls));
            return el;
        }

        var lazyParent = findAncestor(elem[0], 'lazy-scroll');

        if (lazyParent) {
            $timeout(function() {
                $scope.$emit('lazyScroll:childUpdate');
                var x = Math.abs((lazyParent.scrollTop - lazyParent.getBoundingClientRect().height));
                var y = Math.abs((lazyParent.getBoundingClientRect().top - elem[0].getBoundingClientRect().top));

                if (x > y) {
                    var src = attr.lazySrc;
                    elem.removeAttr('lazy-src');

                    elem.attr('src', src);
                    elem.addClass('lazy-done');
                }
            }, 300);
        }
    }

    return {
        restrict: 'A',
        link: link
    }
}]);