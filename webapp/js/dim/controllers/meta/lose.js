define([
    'dim/topic'
], function(topic) {
    var exports = {};

    exports.create = function(world) {
        topic('menu.clear').publish();
        topic('world.event').publish(world, world.get_ctrl('lose'));
        return this;
    };

    return exports;
});