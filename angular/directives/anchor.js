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
});