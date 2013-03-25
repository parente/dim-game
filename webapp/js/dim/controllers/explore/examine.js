define([
    'jquery',
    'dim/topic',
    'dim/util',
    'dim/controllers//menu'
], function($, topic, util, Menu) {
    var exports = {},
        compareNames = util.comparator('visual.name');

    exports.create = function(world) {
        // deep copy examine controller options
        var obj = $.extend(true, {}, world.get_ctrl('examine'));
        var scene = world.get_player_scene();
        // add items as examine options
        obj.options = world.get_scene_items(scene);
        // add scene as an examine option too
        obj.options.push(scene);
        if(scene.adjoins.length) {
            // add nearby scenes as examine option
            obj.options.push(obj.nearby);
        }
        // sort by name
        obj.options.sort(compareNames);

        var menu = new Menu(obj);
        menu.on_activate = function() {
            var sceneOrItem = menu.get_selected();
            console.warn(sceneOrItem, obj.nearby.id);
            if(sceneOrItem.id === obj.nearby.id) {
                var report = [],
                    visual = [];
                // get adjoining rooms
                $.each(scene.adjoins, function(i, id) {
                    var s = world.get_scene(id),
                        r = {};
                    visual.push(s.visual.name);
                    r.narration = s.aural.name;
                    report.push(r);
                });
                // add visual to first report
                if(report.length) {
                    report[0].description = visual.join(', ');
                }
                topic('controller.report').publish(world, report);
            } else {
                // get any events associated with examine action
                var events = world.evaluate('examine', sceneOrItem);
                // let events propagate
                events.fire();
            }
            // return to default controller for the scene
            topic('controller.complete').publish(menu);
        };
        menu.on_abort = function() {
            // return to default controller for the scene
            topic('controller.complete').publish(menu);
        };

        return menu;
    };

    return exports;
});