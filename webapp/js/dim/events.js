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

    var evalArrTemplates = function(templates, args) {
        return $.map(templates, function(tmpl, index) {
            return mustache.render(tmpl, {args : args});
        });
    };

    var evalTemplates = function(templates, args) {
        console.log('  events.evalTemplates', templates, args);
        var out = {};
        $.each(templates, function(key, value) {
            var t = $.type(value),
                res;
            if(t === 'array') {
                res = evalArrTemplates(value, args);
                for(var i=0, l=res.length; i<l; i++) {
                    if(res[i] !== undefined) break;
                }
                if(i < l) {
                    out[key] = res;
                } else {
                    delete out[key];
                }
            } else if(t === 'string') {
                res = mustache.render(value, {args : args});
                if(res.length === 0) {
                    // make empty strings undefined for easier mixin
                    delete out[key];
                } else {
                    out[key] = res;
                }
            } else if(t === 'object') {
                out[key] = evalTemplates(value, args);
            } else {
                out[key] = value;
            }
        });
        return out;
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
                    func(event, evalArrTemplates(exec.args, args));
                });
            }

            // fire world.event notification
            // TODO: nice if these were loopable in a subobject
            var notice = {};
            var hasNotice = false;
            if(event.visual) {
                notice.visual = evalTemplates(event.visual, args);
                hasNotice = true;
            }
            if(event.aural) {
                notice.aural = evalTemplates(event.aural, args);
                hasNotice = true;
            }
            if(hasNotice) {
                topic('world.event').publish(world, notice);
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
     * args[0] property name of an item in the indices
     * args[1] property name of the destination container in the indices
     */
    actions.move_item = function(event, args) {
        console.log('  events.actions.move.item', event, args);
        var item = $.getObject(args[0], indices);
        var src = item.container;
        var dest = $.getObject(args[1], indices);

        // remove from src items
        var i = src.items.indexOf(item.id);
        src.items.splice(i, 1);
        // add to dest items
        dest.items.push(item.id);
        item.container = dest;
    };

    /**
     * args[0] property name of a scene in the indices
     */
    actions.move_player = function(event, args) {
        console.log('  events.actions.move.player', event, args);
        indices.player.scene = args[0];
        // TODO: option to trigger move report?
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