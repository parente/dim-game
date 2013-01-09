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

    var clear_pending = function() {
        // flush the queue but the args
        var old = queue;
        queue = [];
        // tell all views to abort
        $.each(views, function(i, view) {
            view.abort();
        });
        // resolve any deferred sentinels; do this after aborting
        // to try to get notifications in order if possible
        $.each(old, function(i, args) {
            if(args.length === 1) {
                args[0].resolve();
            }
        });
    };

    var on_pump = function() {
        var args = queue.shift();
        console.log('pump.on_pump', args);
        if(args.length > 1) {
            // (topic, report), send to views
            pending = $.map(views, function(view) {
                return view.render.apply(view, args);
            });
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
        if(ctrl.get_event()) {
            // clear all pending output if a user event initiated the select
            clear_pending();
        }
        var report = obj_to_reports('user.select', obj);
        queue_report('user.select', report);
    };

    var on_user_activate = function(ctrl, obj) {
        console.log('pump.on_user_activate', ctrl, obj);
        clear_pending();
        var report = obj_to_reports('user.activate', obj);
        queue_report('user.activate', report);
    };

    exports.initialize = function(world, v) {
        objectReport = world.get_default('objectReport');
        views = v;

        // subscribe to topics
        topic('controller.sentinel').subscribe(on_controller_sentinel);
        topic('controller.report').subscribe(on_controller_report);
        topic('world.report').subscribe(on_world_report);
        topic('user.select').subscribe(on_user_select);
        topic('user.activate').subscribe(on_user_activate);
    };

    return exports;
});