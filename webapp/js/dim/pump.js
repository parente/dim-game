define([
    'jquery',
    'dim/topic',
    'jquery.getobject'
], function($, topic) {
    var exports = {},
        views,
        objectReport,
        queue = [],
        pending = null;

    var obj_to_reports = function(topic, obj) {
        var reports = [],
            map = objectReport[topic];
        if(map) {
            for(var i=0,l=map.length; i<l; i++) {
                var report = property_to_channel(map[i], obj);
                if(report) {
                    reports.push(report);
                }
            }
        }
        return reports;
    };

    var property_to_channel = function(map, obj) {
        var report = {},
            size = 0;
        $.each(map, function(property, channel) {
            var value = $.getObject(property, obj);
            if(value) {
                report[channel] = value;
                size++;
            }
        });
        return size ? report : undefined;
    };

    var queue_report = function(topic, report) {
        if($.isArray(report)) {
            $.each(report, function(i, r) {
                queue.push([topic, r]);
            });
        } else {
            queue.push([topic, report]);
        }
        if(!pending) {
            on_pump();
        }
    };

    var on_pump = function() {
        var args = queue.shift();
        console.log('pump.on_pump', args);
        if(args.length > 1) {
            // (topic, report), send to views
            pending = $.map(views, function(view) {
                return view.render.apply(view, args);
            });
            // save args
            pending.args = args;
            $.when.apply($, pending).then(on_complete);
        } else {
            // deferred sentinel, resolve and continue
            args[0].resolve();
            on_complete();
        }
    };

    var on_complete = function() {
        if(queue.length) {
            on_pump();
        } else {
            pending = null;
        }
    };

    var on_world_report = function(world, report) {
        console.log('pump.on_world_report', world, report);
        queue_report('world.report', report);
    };

    var on_controller_sentinel = function(def) {
        console.log('pump.on_controller_sentinel', def);
        queue.push([def]);
        if(!pending) {
            on_pump();
        }
    };

    var on_controller_report = function(ctrl, report) {
        console.log('pump.on_controller_report', ctrl, report);
        queue_report('controller.report', report);
    };

    var on_user_select = function(ctrl, obj) {
        console.log('pump.on_user_select', ctrl, obj);
        var report = obj_to_reports('user.select', obj);
        queue_report('user.select', report);
    };

    var on_user_activate = function(ctrl, obj) {
        console.log('pump.on_user_activate', ctrl, obj);
        if(obj) {
            var report = obj_to_reports('user.activate', obj);
            queue_report('user.activate', report);
        }
    };

    var on_input = function(input, event) {
        if(pending) {
            if(pending.args && pending.args[1].unskippable) {
                // ignore input
                console.log('pump.on_input, unskippable');
                return false;
            }

            // clear any skippable queued reports
            while(queue.length) {
                if(queue[0][1] && queue[0][1].skipWithPrior) {
                    queue.shift();
                } else {
                    break;
                }
            }
            var size = queue.length;
            // tell all views to abort
            $.each(views, function(i, view) {
                view.abort();
            });
            if(size > 0) {
                // stop event propagation if report remain queued
                console.log('pump.on_input, skip');
                return false;
            }
        }
    };

    exports.initialize = function(world, v) {
        // subscribe to topics
        topic('controller.sentinel').subscribe(on_controller_sentinel);
        topic('controller.report').subscribe(on_controller_report);
        topic('world.report').subscribe(on_world_report);
        topic('user.select').subscribe(on_user_select);
        topic('user.activate').subscribe(on_user_activate);

        topic('input.up').subscribe(on_input);
        topic('input.down').subscribe(on_input);
        topic('input.left').subscribe(on_input);
        topic('input.right').subscribe(on_input);
        topic('input.tap').subscribe(on_input);
    };

    exports.start = function(world, v) {
        objectReport = world.get_default('objectReport');
        views = v;
    };

    return exports;
});