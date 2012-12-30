define([
    'jquery',
    'dim/topic'
], function($, topic) {
    var cls = function(args) {
        this.subs = {
            'input.left':$.proxy(this, 'on_left'),
            'input.right':$.proxy(this, 'on_right'),
            'input.tap':$.proxy(this, 'on_tap'),
            'input.up':$.proxy(this, 'on_up')
        };

        // subscribe to input events
        $.each(this.subs, function(key, value) {
            topic(key).subscribe(value);
        });

        // init default values
        this.reset(args);
    };

    cls.prototype.next = function() {
        this.current = 0;
        if(this.args.prompt || this.args.prompts) {
            // notify of menu prompt
            topic('menu.prompt').publish(this);
        }

        // notify of first selection
        topic('menu.select').publish(this);
    };

    cls.prototype.reset = function(args) {
        if(args) {
            this.args = args;
            this.options = args.options;
        }
        this.seq = [];
        this.next();
    };

    cls.prototype.destroy = function() {
        console.log('  menu.destroy');
        $.each(this.subs, function(key, value) {
            topic(key).unsubscribe(value);
        });
    };

    cls.prototype.get_options = function() {
        return this.options;
    };

    cls.prototype.get_option_at = function(i) {
        return this.options[i];
    };

    cls.prototype.get_selected = function() {
        return this.options[this.current];
    };

    cls.prototype.get_sequence = function() {
        var opts = this.options;
        return $.map(this.seq, function(d) {
            return opts[d];
        });
    };

    cls.prototype.get_prompt = function() {
        if(this.args.prompt) {
            return this.args.prompt;
        } else if(this.args.prompts) {
            var i = (this.seq.length >= this.args.prompts.length) ? this.args.prompts.length-1 : this.seq.length;
            return this.args.prompts[i];
        }
    };

    cls.prototype.on_up = function(input, event) {
        console.log('  menu.on_up', this);
        topic('menu.abort').publish(this, event);
        this.on_abort();
    };

    cls.prototype.on_left = function(input, event) {
        console.log('  menu.on_left', this);
        this.current = this.current-1;
        if(this.current < 0) {
            this.current = this.options.length - 1;
        }
        topic('menu.select').publish(this, event);
        this.on_select();
    };

    cls.prototype.on_right = function(input, event) {
        console.log('  menu.on_right', this);
        this.current = this.current+1;
        if(this.current > this.options.length - 1 ){
            this.current = 0;
        }
        topic('menu.select').publish(this, event);
        this.on_select();
    };

    cls.prototype.on_tap = function(input, event) {
        console.log('  menu.on_tap', this);
        this.seq.push(this.current);
        topic('menu.activate').publish(this, event);
        this.on_activate();
    };

    // extension points
    cls.prototype.on_select = function() {};
    cls.prototype.on_activate = function() {};
    cls.prototype.on_abort = function() {};

    return cls;
});