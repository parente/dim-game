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

    var on_report = function(report) {
        console.log('  aural.on_report', report);
        return $.map(channels, function(channel, name) {
            var msg = report[name];
            if(msg) {
                return channel.play(msg);
            }
        });
    };

    var on_activate = function(report) {
        console.log('  aural.on_activate', report);
        return on_report(report);
    };

    var on_select = function(report) {
        console.log('  aural.on_select', report);
        return on_report(report);
    };

    exports.initialize = function(world) {
        var def = $.Deferred();

        var wad = webaudio.initialize(world),
        // TODO: placeholder for proper TTS system init
            ctd = chrometts.initialize(world);

        $.when(world, wad, ctd).then(function(world) {
            var channelDefaults = world.get_default('channels');
            if(channelDefaults) {
                // set aural channel defaults
                $.each(channelDefaults, function(key, value) {
                    if(value.type === 'aural') {
                        channels[key] = new Channel(webaudio, chrometts, value);
                    }
                });
            }
            def.resolve();
        });

        return def;
    };

    exports.reset = function(world) {
        this.abort(true);
    };

    exports.render = function(topic, report) {
        switch(topic) {
            case 'controller.report':
            case 'world.report':
                return on_report(report);
            case 'user.select':
                return on_select(report);
            case 'user.activate':
                return on_activate(report);
        }
    };

    exports.abort = function(force) {
        // stop all channels, letting channel properties dictate what stop means
        $.each(channels, function(name, channel) {
            channel.stop(force);
        });
    };

    return exports;
});