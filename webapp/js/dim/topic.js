define([
    'jquery'
], function($) {
    var topics = {},
        exports = {};

    // all topics
    // controller.activate(controller)
    // controller.request(id)
    // world.event(world, event)
    // input.left(input, event)
    // input.right(input, event)
    // input.up(input, event)
    // input.down(input, event)
    // input.tap(input, event)
    // menu.select(menu, event)
    // menu.activate(menu, event)
    // menu.prompt(menu)
    // menu.clear(menu)
    return function(id) {
        var callbacks,
            method,
            topic = id && topics[id];
        if(!topic) {
            callbacks = $.Callbacks();
            topic = {
                publish : callbacks.fire,
                subscribe : callbacks.add,
                unsubscribe : callbacks.remove
            };
            if(id) {
                topics[id] = topic;
            }
        }
        return topic;
    };
});