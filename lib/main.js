$(function() {
    // show the button to play if audio context is available
    if(window.AudioContext || window.webkitAudioContext) {
        $('#play-nav').show();
        $('#play-button').show();
    }
});