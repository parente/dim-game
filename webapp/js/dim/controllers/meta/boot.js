define([
    'dim/topic',
    'dim/controllers/menu'
], function(topic, Menu) {
    var exports = {};

    exports.create = function(world) {
        // get boot defaults
        var bootMenu = world.get_ctrl('boot'),
            loadMenu = world.get_ctrl('load'),
            slotsMenu = world.get_ctrl('slots'),
            events;

        // check if any slots available to load
        loadMenu.options = [];
        slotsMenu.options.forEach(function(opt) {
            if(localStorage[opt.id]) {
                loadMenu.options.push(opt);
            }
        });

        // if no slots, only give the new game option
        if(!loadMenu.options.length) {
            bootMenu = $.extend(true, {}, bootMenu);
            bootMenu.options = bootMenu.options.slice(1);
        }

        // start the boot menu
        var menu = new Menu(bootMenu);
        menu.on_activate = function on_activate() {
            var events;
            // get option
            var opt = menu.get_selected();

            // move the player into the opening scene
            if(opt.id === 'new') {
                events = world.evaluate('move',
                    world.get_scene(world.get_default('scene')));
                // let events propagate
                events.fire();
                // switch to default controller for the new scene
                topic('controller.complete').publish(menu);
            } else if(opt.id === 'load') {
                // switch menus without disturbing controller state
                menu.reset(loadMenu);
            } else {
                // get the data from the slot
                var worldJson = localStorage[opt.id];
                world.initialize(worldJson);

                // move the player to the scene
                var scene = world.get_player_scene();
                events = world.evaluate('move', scene);
                events.fire();

                // switch to default controller for the new scene
                topic('controller.complete').publish(menu);
            }
        };
        return menu;

    };

    return exports;
});