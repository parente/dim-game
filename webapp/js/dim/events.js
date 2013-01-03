define([
    'jquery',
    'mustache',
    'dim/topic',
    'jquery.getobject'
], function($, mustache, topic) {
    var exports = {},
        actions = {},
        world,
        indices,
        events;

    var evalTemplate = function(template, args) {
        var type = $.type(template);
        if(type === 'array') {
            var arr = $.map(template, function(value) {
                return evalTemplate(value, args);
            });
            return (arr.length) ? arr : undefined;
        } else if(type === 'object') {
            var out = {}, size = 0;
            $.each(template, function(key, value) {
                var s = evalTemplate(value, args);
                if(s !== undefined) {
                    out[key] = s;
                    size++;
                }
            });
            return (size) ? out : undefined;
        } else if(type === 'string') {
            var s = mustache.render(template, {args : args});
            return (s.length) ? s : undefined;
        } else {
            return template;
        }
    };

    var EventCollection = function() {};
    EventCollection.prototype = [];
    EventCollection.prototype.fire = function() {
        console.log('  events.fire');
        // sort events by priority first, descending with default of 0
        this.sort(function(a, b) {
            return (b.event.priority || 0) - (a.event.priority || 0);
        });

        // handle each matched event
        this.forEach(function(pair) {
            var event = pair.event,
                args = pair.args;

            // execute event actions
            if(event.exec) {
                event.exec.forEach(function(exec) {
                    var func = actions[exec.action.replace('.', '_')];
                    func(event, evalTemplate(exec.args, args));
                });
            }

            // fire world.report notification
            if(event.report) {
                var report = evalTemplate(event.report, args);
                topic('world.report').publish(world, report);
            }
        });
    };

    /**
     * args[0] property name to set in indices
     * args[1] value to set
     */
    actions.set = function(event, args) {
        console.log('  events.actions.set', event, args);
        $.setObject(args[0], args[1], indices);
    };

    /**
     * args[0] property name to remove from in the indices
     * args[1] value to remove
     */
    actions.remove = function(event, args) {
        console.log('  events.actions.remove', event, args);
        var arr = $.getObject(args[0], indices);
        var i = arr.indexOf(args[1]);
        var x = arr.splice(i, 1);
    };

    /**
     * args[0] id of the property in the nested index to set to undefined
     */
    actions.del = function(event, args) {
        console.log('  events.actions.del', event, args);
        $.setObject(args[0], undefined, indices);
    };

    /**
     * args[0] topic name
     * args[1..N] topic values
     */
    actions.publish = function(event, args) {
        console.log('  events.actions.publish', event, args);
        var t = topic(args[0]);
        t.publish.apply(t, args.slice(1));
    };

    /**
     * args[0] property name to append to in indices
     * args[1] value to append
     */
    actions.append = function(event, args) {
        console.log('  events.actions.append', event, args);
        // check if we're moving an item to update container info
        var suffix = '.items';
        var item = $.getObject('item.'+args[1], indices);
        var pos = args[0].indexOf(suffix, args[0].length - suffix.length);
        if(item && pos !== -1) {
            // get the old container
            var oldContainer = item.container;
            // get the new container
            var newContainer = $.getObject(args[0].substr(0, pos), indices);
            // remove from existing container
            if(oldContainer) {
                var i = oldContainer.items.indexOf(item.id);
                if(i >= 0) {
                    oldContainer.items.splice(i, 1);
                } else {
                    console.warn('container out of sync for item:', item);
                }
            }
            // assign new container
            item.container = newContainer;
        }

        // append the string
        var arr = $.getObject(args[0], indices);
        arr.push(args[1]);
    };

    exports.evaluate = function(args) {
        var matches = new EventCollection();
        // TODO: expensive, optimize using tree lookup
        for(var i=0,l=events.length; i<l; i++) {
            var event = events[i],
                on = event.on;
            var match = true;
            for(var j=0,m=on.length; j<m; j++) {
                // console.log(event, args[j]);
                if(!args[j]) {
                    // no further arguments to match
                    match = false;
                    break;
                }
                var val = ($.type(args[j]) === 'string') ? args[j] : args[j].id;
                if(on[j] === '**') {
                    // ** matches everything thereafter, regardless of slots
                    break;
                } else if(!args[j] || (val !== on[j] && on[j] !== '*')) {
                    // no match if:
                    // 1) no value for this slot, OR
                    // 2) if there is a value, it doesn't match the the slot declaration,
                    //    and the slot declaration is not *
                    match = false;
                    break;
                }
            }
            if(match) {
                // found the event to eval
                matches.push({event : event, args : args});
            }
        }
        return matches;
    };

    exports.push = function(event) {
        events.push(event);
    };

    exports.initialize = function(l_world, l_indices) {
        world = l_world;
        indices = l_indices;
        events = [];

        // TODO: check all event expressions
        events.forEach(function(event) {
            if(event.exec) {
                event.exec.forEach(function(exec) {
                    if(!actions[exec.action.replace('.', '_')]) {
                        throw new Error('unknown action ' + exec.action);
                    }
                });
            }
        });
    };

    return exports;
});