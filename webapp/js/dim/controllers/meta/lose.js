define([
    'dim/topic'
], function(topic) {
    var exports = {};

    exports.create = function(world) {
        var ctrl = world.get_ctrl('lose');
        topic('controller.report').publish(world, ctrl.report);
        return this;
    };

    return exports;
});