define([
    'dim/topic',
    'dim/world'
], function(topic, world) {
    // disable developer tools when the version is defined
    // i.e., this is a release
    if(typeof DIM_VERSION === 'undefined') {
        window.dim = {};

        dim.world = world;

        dim.publish = function(t, args) {
            topic(t).publish(args);
        };

        dim.move = function(id) {
            var scene = dim.world.get_scene(id);
            dim.world.evaluate('move', scene).fire();
            topic('controller.request').publish();
        };

        dim.take = function(id) {
            var player = world.get_player();
            player.items.push(id);
            var item = world.get_item(id);
            item.properties.push('useable');
        };

        dim.me = function() {
            console.log(world.get_player());
        };

        // skip to upper hallway after freeing friend
        dim.skipToFriend = function() {
            dim.take('hammer');
            dim.take('star');
            dim.take('passCard');
            dim.world.evaluate('use', 'cellKey', 'bathroomHallwayDoor').fire();
            dim.me();
        };

        dim.skipToSittingRoom = function() {
            dim.take('star');
            dim.take('knife');
            dim.take('passCard');
            dim.move('sittingRoom');
        };

        dim.skipToLobbyConfrontation = function() {
            dim.take('gun');
            dim.take('gasoline');
            dim.take('trappedHallwayDoorKey');
            dim.move('lobby');
        };

        dim.skipToBasementMaze = function() {
            dim.take('gun');
            dim.take('passCard');
            dim.move('basement');
        };
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