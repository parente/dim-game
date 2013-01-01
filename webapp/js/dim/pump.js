define([
    'jquery',
    'dim/topic',
    'jquery.getobject'
], function($, topic) {
    var exports = {},
        views,
        propertyReport,
        queue = [],
        pending = null;

    var obj_to_reports = function(obj) {
        var reports = [];
        for(var i=0,l=propertyReport.length; i<l; i++) {
            var report = property_to_channel(propertyReport[i], obj);
            if(report) {
                reports.push(report);
            }
        }
        console.log('REPORTS', reports);
        return reports;
    };

    var property_to_channel = function(map, obj) {
        var report = {},
            size = 0;
        $.each(map, function(property, channel) {
            var value = $.getObject(property, obj);
            // console.log('property', property, 'channel', channel, 'value', value);
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
        // flush the queue
        queue = [];
        // tell all views to abort
        $.each(views, function(view) {
            view.abort();
        });
    };

    var on_pump = function() {
        var args = queue.shift();
        console.log('pump.on_pump', args);
        pending = $.map(views, function(view) {
            return view.render.apply(view, args);
        });
        $.when.apply($, pending).then(on_complete);
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

    var on_controller_report = function(ctrl, report) {
        console.log('pump.on_controller_report', ctrl, report);
        queue_report('controller.report', report);
    };

    var on_user_select = function(ctrl, obj) {
        console.log('pump.on_user_select', ctrl, obj);
        var report = obj_to_reports(obj);
        queue_report('user.select', report);
    };

    var on_user_activate = function(ctrl, obj) {
        console.log('pump.on_user_activate', ctrl, obj);
        var report = obj_to_reports(obj);
        queue_report('user.activate', report);
    };

    exports.initialize = function(world, v) {
        propertyReport = world.get_default('propertyReport');
        views = v;

        // subscribe to topics
        topic('controller.report').subscribe(on_controller_report);
        topic('world.report').subscribe(on_world_report);
        topic('user.select').subscribe(on_user_select);
        topic('user.activate').subscribe(on_user_activate);
    };

    return exports;
});