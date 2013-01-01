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
            return node.html(html).fadeIn(rate || 100);
        });
    };

    var on_report = function(report, pending) {
        console.log('visual.on_report', report);
        // collect deferreds from all actions
        var defs = [];
        if(report.title) {
            defs.push(fade_replace($title, report.title, 250));
        }
        if(report.description) {
            defs.push(fade_replace($description, report.description, 250));
        }
        // TODO: backdrop

        // notify pending resolved when complete
        $.when.apply($, defs).then(function() {
            pending.resolve();
        });
    };

    var on_select = function(report, pending) {
        console.log('visual.on_select', report);
        var def;
        if(report.title) {
            var states = $('.state', $node).length;
            def = fade_replace($message, ((states) ? '&#x21dd;' : '') + report.title);
        }
        $.when(def).then(function() {
            pending.resolve();
        });
    };

    var on_activate = function(report, pending) {
        console.log('visual.on_menu_activate', report);
        if(report.title) {
            var n = $message.clone()
                .insertBefore($message)
                .attr('class', 'state');
        }
        $message.text('');
        // nothing pending, resolve immediately
        pending.resolve();
    };

    exports.initialize = function() {
        // find nodes of interest
        $node = $('#visual');
        $message = $('.message .active', $node);
        $title = $('.title', $node);
        $description = $('.description', $node);
    };

    exports.render = function(topic, report) {
        var pending = $.Deferred();
        switch(topic) {
            case 'controller.report':
            case 'world.report':
                on_report(report, pending);
                break;
            case 'user.select':
                on_select(report, pending);
                break;
            case 'user.activate':
                on_activate(report, pending);
                break;
        }
        return pending;
    };

    // no-op, let the latest visual action finish
    exports.abort = function() {};

    return exports;
});