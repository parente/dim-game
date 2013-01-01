define([
    'jquery',
    'dim/aural/channel',
    'dim/aural/webaudio',
    'dim/aural/chrometts',
    'dim/topic',
    'jquery.getobject'
], function($, Channel, webaudio, chrometts, topic) {
    var exports = {},
        channels = {};

    var send_to_channel = function(ch, msgs, stop) {
        var channel = channels[ch];
        if(!channel) {
            // TODO: include proper tts for platform
            channel = new Channel(webaudio, chrometts);
            channels[ch] = channel;
        }
        // stop all channels, let channel settings dictate how
        // stop is obeyed
        if(stop) {
            channel.stop();
        }
        channel.queue(msgs);
    };

    var on_world_event = function(world, event) {
        console.log('aural.on_world_event', world, event);
        if(event.aural) {
            // get the aural defaults from the world
            var chans = world.get_default('aural');
            // build a new object combining the defaults and the event props
            chans = $.extend({}, chans);
            chans = $.extend(chans, event.aural);

            $.each(chans, function(ch, msgs) {
                send_to_channel(ch, msgs);
            });
        }
    };

    var on_menu_prompt = function(menu, event) {
        var obj = menu.get_prompt();
        console.log('aural.on_menu_prompt', obj);
        if(obj.aural) {
            $.each(obj.aural, function(ch, msgs) {
                // use event presence as a stop flag
                send_to_channel(ch, msgs, !!event);
            });
        }
    };

    var on_menu_select = function(menu, event) {
        var obj = menu.get_selected();
        console.log('aural.on_menu_select', obj);
        if(obj.aural) {
            // TODO: map name to narration, ugly but haven't
            // found a better place for it yet
            if(obj.aural.name) {
                tmp = {};
                tmp.aural = {'narration' : obj.aural.name};
                obj = tmp;
            }
            // TODO: don't stop again if prompt already stopped
            // appears to be working, why?
            $.each(obj.aural, function(ch, msgs) {
                send_to_channel(ch, msgs, !!event);
            });
        }
    };

    var on_menu_activate = function(menu) {
        console.log('aural.on_menu_activate', menu);
        // stop all existing channels to allow next output
        // to proceed immediately
        $.each(channels, function(name, channel) {
            channel.stop();
        });
    };

    var on_menu_clear = function(ctrl) {
        console.log('aural.on_menu_clear', ctrl);
        // clear happens after next speech queues, so don't stop
    };

    var on_menu_abort = function(ctrl) {
        console.log('aural.on_menu_abort', ctrl);
        // stop on abort
        $.each(channels, function(name, channel) {
            channel.stop();
        });
    };

    exports.initialize = function(world) {
        var def = $.Deferred();

        // TODO: initialize other audio subsystems
        var wad = webaudio.initialize(world),
        // TODO: placeholder for proper TTS system init
            ctd = chrometts.initialize(world);

        $.when(wad, ctd, world).then(function(tmp, tmp1, world) {
            var channelDefaults = world.get_default('channels');
            if(channelDefaults) {
                // set channel defaults
                $.each(channelDefaults, function(key, value) {
                    channels[key] = new Channel(webaudio, chrometts, value);
                });
            }
            def.resolve();
        });

        return def;
    };

    exports.render = function(topic, report) {
        // return $.Deferred();
    };

    return exports;
});