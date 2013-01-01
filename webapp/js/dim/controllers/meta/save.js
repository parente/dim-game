define([
    'dim/topic',
    'dim/controllers/menu'
], function(topic, Menu) {
    var exports = {};

    exports.create = function(world) {
        // get menu defaults
        var saveMenu = world.get_ctrl('save'),
            slotsMenu = world.get_ctrl('slots');

        // add the game slots to the menu
        saveMenu.options = slotsMenu.options;

        // build menu of save slots
        var menu = new Menu(saveMenu);
        menu.on_activate = function on_activate() {
            // get selected slot
            var slot = menu.get_selected();
            // get the world json
            var worldJson = world.get_json();
            // stuff the data into local storage
            localStorage[slot.id] = worldJson;
            // public success notification
            topic('controller.report').publish(world, saveMenu.success);
            // switch to default controller for the new scene
            topic('controller.complete').publish(menu);
        };
        return menu;

    };

    return exports;
});