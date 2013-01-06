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
        if(this.props.swapstop) {
            if(this.pending && this.pending.msg === msg) {
                // already playing this message, continue
                return;
            }
            // stop before starting new message
            this.sound.stop(this.pending);
            this.speech.stop(this.pending);
        }

        // check if the sound system can play it as a waveform first
        if(this.sound.can_play(msg)) {
            this.pending = this.sound.play(msg, this.props);
        } else if(this.speech.can_say(msg)) {
            // check if we have text-to-speech to speak the message
            this.pending = this.speech.say(msg, this.props);
        } else {
            this.pending = null;
        }
        return this.pending;
    };

    cls.prototype.stop = function() {
        if(this.props.swapstop) {
            return;
        }
        // stop all output
        this.sound.stop(this.pending);
        this.speech.stop(this.pending);
        this.pending = null;
    };

    cls.prototype.replace = function(msgs) {
        var msg = msgs;
        if($.isArray(msg)) {
            msg = msg[msg.length-1];
        }
        // check if already playing the requested message
        if(!this.pending || this.pending.msg !== msg) {
            // start new sound / speech
            this.sound.stop(this.pending);
            this.speech.stop(this.pending);
            this.play(msg);
        }
    };

    cls.prototype.set_properties = function(props) {
        $.extend(this.props, props);
    };

    cls.prototype.get_property = function(name) {
        return this.props[name];
    };

    return cls;
});