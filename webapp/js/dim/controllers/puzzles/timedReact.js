define([
    'jquery',
    'dim/topic',
    'dim/controllers/dpad'
], function($, topic, DPad) {
    var exports = {};

    var compare = function(seq, correct) {
        // only compare as many elements as sequence has
        var c = correct.slice(0, seq.length);
        var match;
        for(var i=0,l=c.length; i<l; i++) {
            if(c[i] !== seq[i].id) return false;
        }
        return true;
    };

    var fail = function(ctrlId, reason, menu) {
        var events = world.evaluate('fail', ctrlId, reason);
        events.fire();
        topic('controller.complete').publish(menu);
    };

    exports.create = function(world, ctrlId) {
        // get pattern artifacts
        var ctrl = world.get_ctrl(ctrlId),
            timer;

        // queue a sentinel to receive notification of when to start the timer
        // do it after each prompt so we're not timing the user until he/she has
        // heard the instructions
        var startTimer = function(ctrl, menu) {
            topic('controller.sentinel').expect().then(function() {
                timer = setTimeout(function() {
                    fail(ctrl.id, 'timeout', menu);
                }, ctrl.actionTimeout * 1000);
            });
        };

        // build a dpad with an initial prompt
        var menu = new DPad(ctrl);
        // queue a deferred immediately to start the timer after the first prompt plays
        startTimer(ctrl, menu);
        menu.on_select = function() {
            var seq = menu.get_sequence(),
                complete = (seq.length === ctrl.correct.length),
                match = compare(seq, ctrl.correct),
                events;

            if(!match) {
                if(ctrl.failOnMismatch) {
                    // mismatch, failed
                    clearTimeout(timer);
                    fail(ctrlId, 'mismatch', menu);
                } else {
                    // mismatch, retry and reset
                    events = world.evaluate('retry', ctrlId);
                    events.fire();
                    menu.reset();
                    // start a new timer after the prompt
                    if(ctrl.restartTimerOnMismatch) {
                        clearTimeout(timer);
                        startTimer(ctrl, menu);
                    }
                }
            } else if(complete) {
                // match, solved
                clearTimeout(timer);
                events = world.evaluate('solve', ctrlId);
                events.fire();
                topic('controller.complete').publish(menu);
            } else {
                // match so far, continue with next prompt
                menu.next();
                if(ctrl.restartTimerOnMatch) {
                    clearTimeout(timer);
                    startTimer(ctrl, menu);
                }
            }
        };

        // just use the dpad as the controller to track
        return menu;
    };

    return exports;
});