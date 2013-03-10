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

    cls.prototype.next = function() {
        this.event = null;
        if(this.args.prompt) {
            // prompt user to take action
            topic('controller.report').publish(this, this.get_prompt());
        }
    };

    cls.prototype.reset = function(args) {
        this.seq = [];
        if(args) {
            this.args = args;
            var opts = this.options = {};

            // look for directions in options, taking last one defined by id
            // in array
            $.each(args.options, function(i, opt) {
                opts[opt.id] = opt;
            });
        }

        this.next();
    };

    cls.prototype.destroy = function() {
        console.log('  dpad.destroy');
        $.each(this.subs, function(key, value) {
            topic(key).unsubscribe(value);
        });
        this.on_destroy();
    };

    cls.prototype.get_event = function() {
        return this.event;
    };

    cls.prototype.get_options = function() {
        return this.options;
    };

    cls.prototype.get_selected = function() {
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
        if(this.args.prompt) {
            var i = (this.seq.length >= this.args.prompt.length) ? this.args.prompt.length-1 : this.seq.length;
            return this.args.prompt[i];
        }
    };

    cls.prototype.on_left = function(input, event) {
        console.log('  dpad.on_left', this);
        this.event = event;
        var d = this.options['left'];
        if(d) {
            this.seq.push('left');
            topic('user.select').publish(this, d);
            this.on_select();
        }
    };

    cls.prototype.on_right = function(input, event) {
        console.log('  dpad.on_right', this);
        this.event = event;
        var d = this.options['right'];
        if(d) {
            this.seq.push('right');
            topic('user.select').publish(this, d);
            this.on_select();
        }
    };

    cls.prototype.on_up = function(input, event) {
        console.log('  dpad.on_up', this);
        this.event = event;
        var d = this.options['up'];
        if(d) {
            this.seq.push('up');
            topic('user.select').publish(this, d);
            this.on_select();
        }
    };

    cls.prototype.on_down = function(input, event) {
        console.log('  dpad.on_down', this);
        this.event = event;
        var d = this.options['down'];
        if(d) {
            this.seq.push('down');
            topic('user.select').publish(this, d);
            this.on_select();
        }
    };

    cls.prototype.on_tap = function(input, event) {
        console.log('  dpad.on_tap', this);
        var d = this.options['tap'];
        if(d) {
            this.seq.push('tap');
            topic('user.select').publish(this, d);
            this.on_select();
        }
    };

    // extension points
    cls.prototype.on_select = function() {};
    cls.prototype.on_destroy = function() {};

    return cls;
});