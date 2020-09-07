/*var _LOCK_BUTTON = document.querySelector("#lock-landscape-button"),
    // _UNLOCK_BUTTON = document.querySelector("#unlock-button"),
    _STATUS = document.querySelector("#orientation-status");*/

// _STATUS.innerHTML = screen.orientation.type + ' mode';

/* Get the documentElement (<html>) to display the page in fullscreen */
var elem = document.documentElement;

var is_full_screen = false;

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        if(typeof requestFullScreen !== 'undefined') requestFullScreen.call(docEl);
    }
    else {
        if(typeof cancelFullScreen !== 'undefined') cancelFullScreen.call(doc);
    }
}
// upon lock to landscape-primary mode

/* View in fullscreen */
function landScapeMode() {
    toggleFullScreen();

    if(typeof window.screen.orientation !== 'undefined'){
        window.screen.orientation.lock("landscape-primary")
            .then(function () {

            })
            .catch(function (error) {
                //alert(error);
            });
    }

}

/* Close fullscreen */
function closeFullscreen() {
    if (document.body.exitFullscreen) {
        document.body.exitFullscreen();
    } else if (document.body.mozCancelFullScreen) { /* Firefox */
        document.body.mozCancelFullScreen();
    } else if (document.body.webkitExitFullscreen) { /* Chrome, Safari and Opera */
        document.body.webkitExitFullscreen();
    } else if (document.body.msExitFullscreen) { /* IE/Edge */
        document.body.msExitFullscreen();
    }

    is_full_screen = false;
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
    return new Date(this.substr(0, 10).replace(/-/g, "/"));
};

String.prototype.formatDate = function(){
    return this.substr(0, 10).replace(/-/g, "/");
};

String.prototype.formatUnit = function () {
    return this >= 10000 ? this/10000 + "萬" : this;
};

Number.prototype.formatUnit = function () {
    return this >= 10000 ? this/10000 + "萬" : this;
};

Number.prototype.round =function(){
    return Math.round(this)
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

/**
 *
 * @param cname
 * @param cvalue
 * @param exdays
 */
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 *
 * @param cname
 * @returns {string}
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
/*

window.onload = function (ev) {

    var value = getComputedStyle(document.querySelector("body section"));
   alert(JSON.stringify([

       value.width,
       value.height
   ]))
};
*/
