define([
    'jquery',
    'dim/topic'
], function($, topic) {
    var cls = function(args) {
        this.subs = {
            'input.left':$.proxy(this, 'on_left'),
            'input.right':$.proxy(this, 'on_right'),
            'input.down':$.proxy(this, 'on_down'),
            'input.up':$.proxy(this, 'on_up'),
            'input.tap':$.proxy(this, 'on_tap')
        };

        // subscribe to input events
        $.each(this.subs, function(key, value) {
            topic(key).subscribe(value);
        });

        // init default values
        this.reset(args);
    };

    cls.prototype.reset = function(args) {
        this.args = args;
        this.options = args.options;
        this.seq = [];

        if(args.prompt) {
            // notify of prompt
            topic('controller.prompt').publish(this);
        }
    };

    cls.prototype.destroy = function() {
        console.log('  dpad.destroy');
        $.each(this.subs, function(key, value) {
            topic(key).unsubscribe(value);
        });
    };

    cls.prototype.get_options = function() {
        return this.options;
    };

    cls.prototype.get_current = function() {
        var d = this.seq[this.seq.length - 1];
        return this.options[d];
    };

    cls.prototype.get_sequence = function() {
        var opts = this.options;
        return $.map(this.seq, function(d) {
            return opts[d];
        });
    };

    cls.prototype.get_prompt = function() {
        return this.args.prompt;
    };

    cls.prototype.on_left = function(input, event) {
        console.log('  dpad.on_left', this);
        this.seq.push('left');
        topic('user.activate').publish(this, event);
        this.on_activate();
    };

    cls.prototype.on_right = function(input, event) {
        console.log('  dpad.on_right', this);
        this.seq.push('right');
        topic('user.activate').publish(this, event);
        this.on_activate();
    };

    cls.prototype.on_up = function(input, event) {
        console.log('  dpad.on_up', this);
        this.seq.push('up');
        topic('user.activate').publish(this, event);
        this.on_activate();
    };

    cls.prototype.on_down = function(input, event) {
        console.log('  dpad.on_down', this);
        this.seq.push('down');
        topic('user.activate').publish(this, event);
        this.on_activate();
    };

    cls.prototype.on_tap = function(input, event) {
        console.log('  dpad.on_tap', this);
        this.seq.push('tap');
        topic('user.activate').publish(this, event);
        this.on_activate();
    };


    // extension points
    cls.prototype.on_activate = function() {};

    return cls;
});