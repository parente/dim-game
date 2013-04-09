define([
    'jquery',
    'require',
    'dim/events',
    'dim/topic',
    'text!../../data/world.json'
], function($, require, events, topic, worldJson) {
    var exports = {},
        uid = 0,
        world,
        indices,
        uris;


    exports.initialize = function(stateJson) {
        var json, hasVersion;
        // TODO: need an upgrade path
        if(stateJson) {
            world = JSON.parse(stateJson);
            json = stateJson;
        } else {
            world = JSON.parse(worldJson);
            json = worldJson;
        }

        // create empty indices
        indices = {
            'default': null,
            'player': null,
            'ctrl': {},
            'scene': {},
            'item': {},
            'event': {}
        };

        // pull out items by types
        $.each(world, function(i, obj) {
            var id;
            switch(obj.type) {
                case 'default':
                    indices['default'] = obj;
                    break;
                case 'player':
                    indices.player = obj;
                    break;
                case 'ctrl':
                    indices.ctrl[obj.id] = obj;
                    break;
                case 'scene':
                    indices.scene[obj.id] = obj;
                    break;
                case 'item':
                    indices.item[obj.id] = obj;
                    break;
                case 'event':
                    if(obj.id === undefined) {
                        id = uid++;
                    } else {
                        id = obj.id;
                    }
                    indices.event[id] = obj;
                    break;
                case 'version':
                    hasVersion = true;
            }
        });

        if(!hasVersion) {
            // build overrides with specific version #
            if (typeof DIM_VERSION === 'undefined') DIM_VERSION = (new Date()).getTime();
            // get the version into the world data for persistence
            world.push({
                type: 'version',
                value: DIM_VERSION
            });
        }

        // provide the events with a private interface to the world indices
        events.initialize(this, indices);

        // yank all media uris for later use
        // TODO if we re-init, we have a problem with anything that has read these
        // e.g., on loading a save game
        uris = [];
        var regex = new RegExp('"([^"]+://[^"]+)"', 'g');
        var match;
        while((match = regex.exec(json)) !== null) {
            uris.push(match[1]);
        }

        // track item containers
        $.each(indices.scene, function(sid, scene) {
            $.each(scene.items, function(i, id) {
                item = indices.item[id];
                item.container = scene;
            });
        });

        // we're ready synchronously right now, so return a resolved
        // deferred
        var d = new $.Deferred();
        return d.resolve(this);
    };

    exports.get_media_uris = function(pattern) {
        if(pattern) {
            return $.grep(uris, function(uri) {
                return uri.search(pattern) > -1;
            });
        } else {
            return uris;
        }
    };

    exports.media_uri_to_url = function(uri) {
        var i = uri.search('://');
        if(i < 0) return;
        return require.toUrl('../../data/'+uri.slice(i+3));
    };

    exports.evaluate = function(action) {
        var args = [action];
        for(var i=1; i<arguments.length; i++) {
            var arg = arguments[i];
            args.push(arg);
        }
        return events.evaluate(args);
    };

    exports.get_player_items = function(predicate) {
        var items = [];
        indices.player.items.forEach(function(id) {
            var item = indices.item[id];
            if(!$.isFunction(predicate) || predicate(item)) {
                items.push(item);
            }
        });
        return items;
    };

    exports.get_player_scene = function() {
        return this.get_scene(indices.player.scene);
    };

    exports.get_scene_items = function(objOrId, predicate) {
        var scene = indices.scene[objOrId] || objOrId;
        var items = [];
        scene.items.forEach(function(id) {
            var item = indices.item[id];
            if(!$.isFunction(predicate) || predicate(item)) {
                items.push(item);
            }
        });
        return items;
    };

    exports.get_scene_adjoins = function(objOrId, predicate) {
        var scene = indices.scene[objOrId] || objOrId;
        var adjoins = [];
        scene.adjoins.forEach(function(id) {
            var scene = indices.scene[id];
            if(!$.isFunction(predicate) || predicate(scene)) {
                adjoins.push(scene);
            }
        });
        return adjoins;
    };

    exports.get_scene = function(id) {
        return indices.scene[id];
    };

    exports.get_default = function(id) {
        return indices['default'][id];
    };

    exports.get_item = function(id) {
        return indices.item[id];
    };

    exports.get_event = function(id) {
        return indices.event[id];
    };

    exports.get_player = function() {
        return indices.player;
    };

    exports.get_ctrl = function(id) {
        return indices.ctrl[id];
    };

    exports.get_json = function() {
        return JSON.stringify(world);
    };

    return exports;
});