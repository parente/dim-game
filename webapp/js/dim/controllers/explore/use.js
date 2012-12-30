define([
    'jquery',
    'dim/topic',
    'dim/controllers/menu'
], function($, topic, Menu) {
    var exports = {};

    exports.create = function(world) {
        // deep copy controller values because we're going to modify
        var obj = $.extend(true, {}, world.get_ctrl('use'));
        var scene = world.get_player_scene();
        var args = ['use'];

        // add useable items in the inventory as options
        var inScene = world.get_player_items(function(item) {
            return ($.inArray('useable', item.properties) > -1);
        });

        // add useable items in the scene as options
        obj.options = inScene.concat(world.get_scene_items(scene, function(item) {
            return ($.inArray('useable', item.properties) > -1);
        }));

        if(obj.options.length === 0) {
            // notify nothing to use and return to main controller
            topic('world.event').publish(world, obj.nothingUseable);
            return null;
        }

        // build menu of useable items
        var on_activate = function() {
            var item = menu.get_selected();
            args.push(item);
            // get any events associated with use action and items selected
            var events = world.evaluate.apply(world, args);
            if(!events.length) {
                if(args.length < 3 && obj.options.length > 1) {
                    // no matches, allow select of a second item
                    // don't include the selected item as an option
                    var i = obj.options.indexOf(item);
                    obj.options.splice(i, 1);
                    // switch to interaction prompt
                    obj.prompt = obj.promptInteract;
                    // switch menus without disturbing controller state
                    menu.reset(obj);
                } else if(args.length >= 3) {
                    // no matches and two items selected, note no interaction
                    topic('world.event').publish(world, obj.noInteraction);
                    topic('controller.complete').publish(menu);
                } else {
                    // no matches and only 1 item available, note no action
                    topic('world.event').publish(world, obj.noAction);
                    topic('controller.complete').publish(menu);
                }
            } else {
                // match, let events propagate
                events.fire();
                // switch to default controller for the scene
                topic('controller.complete').publish(menu);
            }
        };

        var on_abort = function() {
            topic('controller.complete').publish(menu);
        };

        // bootstrap first menu
        var menu = new Menu(obj);
        menu.on_activate = on_activate;
        menu.on_abort = on_abort;
        return menu;
    };

    return exports;
});