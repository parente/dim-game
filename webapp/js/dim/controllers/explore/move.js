define([
    'dim/topic',
    'dim/util',
    'dim/controllers/menu'
], function(topic, util, Menu) {
    var exports = {};

    exports.create = function(world) {
        // get menu defaults
        var obj = world.get_ctrl('move'),
            scene = world.get_player_scene(),
            compareNames = util.comparator('visual.name');

        // add adjoining scenes as movement options
        obj.options = world.get_scene_adjoins(scene);

        if(obj.options.length === 0) {
            // notify can't move and return to main controller
            topic('controller.report').publish(world, obj.impossible);
            return null;
        }

        // sort in reasonable order
        obj.options.sort(compareNames);

        // build menu of adjoining scenes
        var menu = new Menu(obj);
        menu.on_activate = function() {
            var scene = menu.get_selected();
            // get any events associated with move action
            var events = world.evaluate('move', scene);
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