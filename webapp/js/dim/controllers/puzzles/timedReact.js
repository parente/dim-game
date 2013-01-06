define([
    'dim/topic',
    'dim/controllers/dpad'
], function(topic, DPad) {
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

    exports.create = function(world, ctrlId) {
        // get pattern artifacts
        var ctrl = world.get_ctrl(ctrlId);

        // build a dpad with an initial prompt
        var menu = new DPad(ctrl);
        menu.on_select = function() {
            var seq = menu.get_sequence(),
                complete = (seq.length === ctrl.correct.length),
                match = compare(seq, ctrl.correct),
                events;

            if(!match) {
                if(ctrl.failOnMismatch) {
                    // mismatch, failed
                    events = world.evaluate('fail', ctrlId);
                    events.fire();
                    topic('controller.complete').publish(menu);
                } else {
                    // mismatch, retry and reset
                    events = world.evaluate('retry', ctrlId);
                    events.fire();
                    menu.reset();
                }
            } else if(complete) {
                // match, solved
                events = world.evaluate('solve', ctrlId);
                events.fire();
                topic('controller.complete').publish(menu);
            } else {
                // match so far, continue with next prompt
                menu.next();
            }
        };

        // just use the dpad as the controller to track
        return menu;
    };

    return exports;
});