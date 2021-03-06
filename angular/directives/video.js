gamingApp.directive('ngPoster', function() {
    return {
        priority:   99,
        link:       function(scope, elem, attr) {
            attr.$observe('ngPoster', function(value) {
                attr.$set('poster', value);
            });
        }
    }
}).directive('ngVideo', function () {
    return {
        restrict: "A",
        transclude: false,
        link: function (scope, elem, attrs) {
            elem.on('play', function(e){
                scope.$emit("videoPlay", elem)
            });
            elem.on('pause', function(e){
                scope.$emit("videoPause", elem)
            });
            elem.on('loadstart', function(e){
                scope.$emit("videoLoading", elem)
            });
            elem.on('loadeddata', function(e){
                scope.$emit("videoLoaded", elem)
            });
            /*elem.on('click', function(e){
                elem[0].pause();
            });*/
            scope.$on("playVideo", function (e, src) {
                if(typeof src !== 'undefined')
                    elem.attr("src", src);

                if(elem[0].paused)
                    elem[0].play();
            });
            if(typeof attrs['src'] === "undefined"){
                scope.$emit("videoBegin", elem)
            }
        }
    }
});