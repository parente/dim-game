define([
    'dim/topic',
    'dim/controllers/menu'
], function(topic, Menu) {
    var exports = {};

    exports.create = function(world) {
        // get menu defaults
        var obj = world.get_ctrl('take');
        var scene = world.get_player_scene();

        // add takeable items in the scene as options
        obj.options = world.get_scene_items(scene, function(item) {
            return ($.inArray('takeable', item.properties) > -1);
        });

        if(obj.options.length === 0) {
            // notify can't take and return to main controller
            topic('world.event').publish(world, obj.impossible);
            return null;
        }

        // build menu of takeable items
        var menu = new Menu(obj);
        menu.on_activate = function() {
            var item = menu.get_selected();
            // get any events associated with take action
            var events = world.evaluate('take', item);
            // let events propagate
            events.fire();
            // switch to default controller for the new scene
            topic('controller.complete').publish(menu);
        };

        menu.on_abort = function() {
            topic('controller.complete').publish(menu);
        };
        return menu;
    };

    return exports;
});