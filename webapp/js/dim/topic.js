define([
    'jquery'
], function($) {
    var topics = {},
        exports = {};

    return function(id) {
        var callbacks,
            method,
            topic = id && topics[id];
        if(!topic) {
            callbacks = $.Callbacks('stopOnFalse');
            topic = {
                expect: function() {
                    var d = new $.Deferred();
                    callbacks.fire(d);
                    return d;
                },
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