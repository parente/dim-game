define([
    'require',
    'jquery',
    'dim/topic',
    'jquery.doubletap'
],function(require, $, topic) {
    var exports = {},
        UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39,
        ENTER = 13, SPACE = 32;

    var on_key_up = function(event) {
        console.log('input.on_key_up', event);
        if(event.keyCode === LEFT) {
           topic('input.left').publish(this, event);
        } else if(event.keyCode === RIGHT) {
            topic('input.right').publish(this, event);
        } else if(event.keyCode === UP) {
            topic('input.up').publish(this, event);
        } else if(event.keyCode === DOWN) {
            topic('input.down').publish(this, event);
        } else if(event.keyCode === ENTER || event.keyCode === SPACE) {
            topic('input.tap').publish(this, event);
        }
    };

    var on_key_down = function(event) {
        switch(event.keyCode) {
            case LEFT:
            case RIGHT:
            case UP:
            case DOWN:
            case ENTER:
            case SPACE:
                event.preventDefault();
        }
    };

    var on_swipe = function(event, touch) {
        console.log('input.on_swipe', event);
        if(touch.eventType === 'swipeleft') {
            topic('input.left').publish(this, event);
        } else if(touch.eventType === 'swiperight') {
            topic('input.right').publish(this, event);
        } else if(touch.eventType === 'swipeup') {
            topic('input.up').publish(this, event);
        } else if(touch.eventType === 'swipedown') {
            topic('input.down').publish(this, event);
        }
    };

    var on_focus = function(event) {
        var dir = $(event.target).data('direction');
        if(dir === 'center') {
            return;
        }

        console.log('input.on_focus', event);
        if(dir === 'left') {
           topic('input.left').publish(this, event);
        } else if(dir === 'right') {
            topic('input.right').publish(this, event);
        } else if(dir === 'up') {
            topic('input.up').publish(this, event);
        } else if(dir === 'down') {
            topic('input.down').publish(this, event);
        }
        setTimeout(function() {
            // snap dpad back to center
            $('#dpad').focus();
        }, 1);
    };

    var on_tap = function(event) {
        console.log('input.on_tap');
        topic('input.tap').publish(this, event);
    };

    exports.initialize = function() {
        // disable elastic scroll except for content region
        // TODO: allow scroll on description area
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);

        // watch for key/gesture events globally
        $('body').keyup(on_key_up).keydown(on_key_down);
        $('body').addSwipeEvents().bind('tap', on_tap)
            .bind('swipe', on_swipe);

        // watch for focus events on the virtual dpad
        $('#input').on('focusin', 'td', on_focus);
        $('#dpad').addSwipeEvents().bind('tap', on_tap);

        // give the dpad focus always
        $('#dpad').focus();
    };

    exports.reset = function() {
        // give the dpad focus always
        $('#dpad').focus();
    };

    return exports;
});