define(['jquery'], function($) {
    var cls = function(sound, speech, props) {
        // sound and speech renders
        this.sound = sound;
        this.speech = speech;
        // persistent channel properties
        this.props = props || {};
        // queue of items to render
        this.q = [];
        // pending output completion, also a busy flag
        this.pending = null;
    };

    cls.prototype.stop = function() {
        if(this.props.swapstop) {
            return;
        }
        // dump the queue
        this.q = [];
        // stop all output
        this.sound.stop(this.pending);
        this.speech.stop(this.pending);
    };

    cls.prototype.skip = function() {
        if(this.props.swapstop) {
            return;
        }
        // stop all output
        this.sound.stop(this.pending);
        this.speech.stop(this.pending);
        // deferred error on stop will cause next pump
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
            this.q.push(msgs);
            this.on_pump();
        }
    };

    cls.prototype.queue = function(msgs) {
        if(this.props.swapstop) {
            this.replace(msgs);
        } else {
            if($.isArray(msgs)) {
                this.q = this.q.concat(msgs);
            } else {
                this.q.push(msgs);
            }
            if(!this.pending) {
                this.on_pump();
            }
        }
    };

    cls.prototype.set_properties = function(props) {
        $.extend(this.props, props);
    };

    cls.prototype.get_property = function(name) {
        return this.props[name];
    };

    cls.prototype.on_pump = function() {
        var msg = this.q.shift();
        console.log('  channel.on_pump', msg);
        // check if the sound system can play it as a waveform first
        if(this.sound.can_play(msg)) {
            this.pending = this.sound.play(msg, this.props);
        } else if(this.speech.can_say(msg)) {
            // check if we have text-to-speech to speak the message
            this.pending = this.speech.say(msg, this.props);
        } else {
            // if we can't handle either, continue pumping
            if(this.q.length) {
                this.on_pump();
            }
            return;
        }
        // listen for resolution or rejection of the deferred result
        var cb = $.proxy(this.on_complete, this);
        this.pending.then(cb, cb);
    };

    cls.prototype.on_complete = function() {
        // continue pumping the queue or just return if nothing to pump
        if(this.q.length) {
            this.on_pump();
        } else {
            this.pending = null;
        }
    };

    return cls;
});