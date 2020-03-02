var _LOCK_BUTTON = document.querySelector("#lock-landscape-button"),
    // _UNLOCK_BUTTON = document.querySelector("#unlock-button"),
    _STATUS = document.querySelector("#orientation-status");

// _STATUS.innerHTML = screen.orientation.type + ' mode';

// upon lock to landscape-primary mode
function landScapeMode() {

    if (document.documentElement.requestFullscreen) {
        document.querySelector("#container").requestFullscreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.querySelector("#container").webkitRequestFullScreen();
    }

    screen.orientation.lock("landscape-primary")
        .then(function () {
            _LOCK_BUTTON.style.display = 'none';
            // _UNLOCK_BUTTON.style.display = 'block';
        })
        .catch(function (error) {
            alert(error);
        });
}

// upon unlock
/*document.querySelector("#unlock-button").addEventListener('click', function () {
    screen.orientation.unlock();

    _LOCK_BUTTON.style.display = 'block';
    // _UNLOCK_BUTTON.style.display = 'none';
});*/
// when screen orientation changes
screen.orientation.addEventListener("change", function () {
    // _STATUS.innerHTML = screen.orientation.type + ' mode';
});
// on exiting full-screen lock is automatically released
document.addEventListener("fullscreenchange", function () {
    _LOCK_BUTTON.style.display = 'block';
    // _UNLOCK_BUTTON.style.display = 'none';
});
document.addEventListener("webkitfullscreenchange", function () {
    _LOCK_BUTTON.style.display = 'block';
    // _UNLOCK_BUTTON.style.display = 'none';
});

function myFunction() {
    document.getElementById("lock-landscape-button").click();
}

//etTimeout(myFunction, 2000);

function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

Number.prototype.formatPrice = function () {
    return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

String.prototype.toDate = function () {
    return new Date(this);
};

String.prototype.formatUnit = function () {
    return this/1000 + "K";
};

Number.prototype.formatUnit = function () {
    return this/1000 + "K";
};
Date.prototype.getRemainTime = function (now) {
    var diff = this.getTime() - now.getTime();
    var hour = diff / (1000*60*60),
        minutes = (hour - (Math.floor(hour)) ) * 60,
        seconds = (minutes - (Math.floor(minutes)) ) * 60;
    return Math.floor(hour) + ":" + Math.floor(minutes) + ":" + Math.floor(seconds);

};

String.prototype.formatPhone = function () {
    return this.match(/^0/) == null ? "0" + this : this;
};


var base_api = "http://gaming.dev.ml-codesign.com:8080/api/";



/**
 * Read image from input
 * @param input
 */
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('.img-placeholder .img').css({'background-image': 'url(' + e.target.result + ')'})
        };

        reader.readAsDataURL(input.files[0]);
    }
}