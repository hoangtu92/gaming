gamingApp.filter('range', function () {
    return function (input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i = min; i < max; i++)
            input.push(i);
        return input;
    };
}).filter("trustUrl", ['$sce', function ($sce) {
    return function (recordingUrl) {
        return $sce.trustAsResourceUrl(recordingUrl);
    };
}]).filter("countDown", function () {
    return function (input, date) {
        var now = new Date();
        var diff = date.toDate().getTime() - now.getTime();
        var hour = diff / (1000 * 60 * 60),
            minutes = (hour - (Math.floor(hour))) * 60,
            seconds = (minutes - (Math.floor(minutes))) * 60;
        input = Math.floor(hour) + ":" + Math.floor(minutes) + ":" + Math.floor(seconds);

        return input;
    }
});