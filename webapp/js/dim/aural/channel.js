define(['jquery'], function($) {
    var cls = function(sound, speech, props) {
        // sound and speech renders
        this.sound = sound;
        this.speech = speech;
        // persistent channel properties
        this.props = props || {};
        // pending output completion, also a busy flag
        this.pending = null;
    };

    cls.prototype.play = function(msg) {
        console.log('    channel.play', msg);
        var def, props;
        if($.isArray(msg)) {
            // mix the channel props and message props
            props = $.extend({}, this.props, msg[1]);
            msg = msg[0];
        } else {
            // take a copy of persistent channel props
            // in case they change while we're playing
            props = $.extend(true, {}, this.props);
        }

        if(this.pending && this.pending.props.swapstop) {
            // if we're playing something that has the swapstop flag set,
            // check if the incoming is the same as what is playing
            if(this.pending.msg === msg) {
                // already playing this message, update props and return
                this.sound.update(this.pending, props);
                this.speech.update(this.pending, props);
                return;
            }
        }

        // if(this.pending && (this.pending.props.loop || this.pending.props.swapstop)) {
        // stop anything leftover before starting a new message
        def = this.pending;
        this.pending = null;
        this.sound.stop(def);
        this.speech.stop(def);
        // }

        // check if the sound system can play it as a waveform first
        if(this.sound.can_play(msg)) {
            this.pending = this.sound.play(msg, props);
        } else if(this.speech.can_say(msg)) {
            // check if we have text-to-speech to speak the message
            this.pending = this.speech.say(msg, props);
        } else {
            this.pending = null;
        }
        return this.pending;
    };

    cls.prototype.stop = function(force) {
        if(this.pending && this.pending.props.swapstop && !force) {
            return;
        }
        // stop all output
        var def = this.pending;
        this.pending = null;
        this.sound.stop(def);
        this.speech.stop(def);
    };

    cls.prototype.set_properties = function(props) {
        $.extend(this.props, props);
    };

    cls.prototype.get_property = function(name) {
        return this.props[name];
    };

    return cls;
});