define([
    'dim/topic',
    'dim/controllers/dpad'
], function(topic, DPad) {
    var exports = {};

    var on_tap = function() {
        topic('reset').publish();
    };

    exports.destroy = function() {
        topic('input.tap').unsubscribe(on_tap);
    };

    exports.create = function(world, id) {
        var ctrl = world.get_ctrl(id);
        if(ctrl && ctrl.report) {
            topic('controller.report').publish(world, ctrl.report);
        }

        // reset entire game
        topic('input.tap').subscribe(on_tap);

        return this;
    };

    return exports;
});