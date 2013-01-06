define([
    'dim/topic'
], function(topic) {
    var exports = {};

    exports.create = function(world, id) {
        var ctrl = world.get_ctrl(id);
        if(ctrl && ctrl.report) {
            topic('controller.report').publish(world, ctrl.report);
        }
        return this;
    };

    return exports;
});