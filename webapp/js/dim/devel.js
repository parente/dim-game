define([
    'dim/topic',
    'dim/world'
], function(topic, world) {
    // will be removed during build
    if (typeof DEVEL === 'undefined') DEVEL = true;
    if(DEVEL) {
        // setup global functions
        move = function(id) {
            var scene = world.get_scene(id);
            world.evaluate('move', scene).fire();
            topic('controller.request').publish();
        };

        take = function(id) {
            var player = world.get_player();
            player.items.push(id);
            var item = world.get_item(id);
            item.properties.push('useable');
        };

        me = function() {
            console.log(world.get_player());
        };

        // skip to upper hallway after freeing friend
        skipToFriend = function() {
            take('hammer');
            take('star');
            take('passCard');
            move('upperHallway');
            world.evaluate('use', 'cellKey', 'bathroomHallwayDoor').fire();
            me();
        };

        skipToLobbyConfrontation = function() {
            take('trappedHallwayDoorKey');
            move('lobby');
        };

        window.world = world;
    }

    // Avoid `console` errors in browsers that lack a console.
    // moved from h5bp plugins.js
    if (!(window.console && console.log)) {
        (function() {
            var noop = function() {};
            var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'markTimeline', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
            var length = methods.length;
            var console = window.console = {};
            while (length--) {
                console[methods[length]] = noop;
            }
        }());
    }
});