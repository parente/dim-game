define([
    'jquery',
    'dim/topic',
    'jquery.getobject'
], function($, topic) {
    var exports = {},
        $node,
        $title,
        $message;

    var fade_replace = function(node, html, rate) {
        return node.promise().pipe(function() {
            return node.fadeOut(rate || 100);
        }).pipe(function() {
            html = html.replace(/\n/g, '<br />');
            node.html(html);
            node.fadeIn(rate || 100);
        });
    };

    var on_report = function(report) {
        console.log('  visual.on_report', report);
        // collect deferreds from all actions
        var defs = [],
            pending = $.Deferred();
        if(report.title) {
            defs.push(fade_replace($title, report.title, 100));
        }
        if(report.description) {
            defs.push(fade_replace($description, report.description, 100));
        }
        // TODO: backdrop

        // notify pending resolved when complete
        $.when.apply($, defs).then(function() {
            pending.resolve();
        });
        return pending;
    };

    var on_select = function(report) {
        console.log('  visual.on_select', report);
        var pending = $.Deferred(),
            def;
        if(report.title) {
            var states = $('.state', $node).length;
            def = fade_replace($message, ((states) ? '&#x21dd;' : '') + report.title);
        }
        $.when(def).then(function() {
            pending.resolve();
        });
        return pending;
    };

    var on_activate = function(report) {
        console.log('  visual.on_menu_activate', report);
        // TODO: maintain breadcrumb history
        //      * left align active causes history to jitter as length of word changes
        //      * repeated right scroll active works but is awkward
        // if(report.title) {
        //     var n = $message.clone()
        //         .insertBefore($message)
        //         .attr('class', 'state');
        // }
        $message.text('');
        // nothing pending
    };

    exports.initialize = function() {
        // find nodes of interest
        $node = $('#visual');
        $message = $('.message .active', $node);
        $title = $('.title', $node);
        $description = $('.description', $node);
    };

    exports.render = function(topic, report) {
        switch(topic) {
            case 'controller.report':
            case 'world.report':
                return on_report(report);
            case 'user.select':
                return on_select(report);
            case 'user.activate':
                return on_activate(report);
        }
    };

    // no-op, let the latest visual action finish
    exports.abort = function() {};

    return exports;
});