$(function() {
    if(webkitAudioContext &&
       !('ontouchstart' in document.documentElement)) {
        $('#play-nav').show();
        $('#play-button').show();
    }
});