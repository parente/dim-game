define([
    'dim/topic',
    'dim/controllers/menu'
], function(topic, Menu) {
    var exports = {};

    exports.create = function(world) {
        // reset all menu state
        topic('menu.clear').publish(this);

        var obj = world.get_ctrl('explore');
        var menu = new Menu(obj);
        menu.on_activate = function on_activate() {
            // publish controller change
            var id = menu.get_selected().id;
            topic('controller.request').publish(id);
        };
        return menu;
    };

    return exports;
});