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

    var on_world_event = function(world, event) {
        console.log('visual.on_world_event', world, event);
        if($.exists('visual.title', event)) {
            fade_replace($title, event.visual.title, 500);
        }
        if($.exists('visual.description', event)) {
            fade_replace($description, event.visual.description, 500);
        }
        // TODO: backdrop
    };

    var on_menu_prompt = function(menu) {
        var prompt = menu.get_prompt();
        if($.exists('visual.description', prompt)) {
            fade_replace($description, prompt.visual.description, 500);
        }
    };

    var on_menu_select = function(menu) {
        var obj = menu.get_selected();
        console.log('visual.on_menu_select', obj);
        if(obj.visual && obj.visual.name) {
            var states = $('.state', $node).length;
            fade_replace($message, ((states) ? '&#x21dd;' : '') + obj.visual.name);
        } else {
            fade_replace($message, '');
        }
    };

    var on_menu_activate = function(menu) {
        var obj = menu.get_selected();
        console.log('visual.on_menu_activate', obj);
        if(obj.visual && obj.visual.name) {
            var n = $message.clone()
                .insertBefore($message)
                .attr('class', 'state');
        }
        $message.text('');
    };

    var on_menu_clear = function(ctrl) {
        console.log('visual.on_menu_clear', ctrl);
        // clear out message bar state
        $('.state', $node).remove();
    };

    exports.initialize = function() {
        // find nodes of interest
        $node = $('#visual');
        $message = $('.message .active', $node);
        $title = $('.title', $node);
        $description = $('.description', $node);

        // subscribe to topics
        topic('world.event').subscribe(on_world_event);
        topic('menu.prompt').subscribe(on_menu_prompt);
        topic('menu.select').subscribe(on_menu_select);
        topic('menu.activate').subscribe(on_menu_activate);
        topic('menu.clear').subscribe(on_menu_clear);
    };

    return exports;
});