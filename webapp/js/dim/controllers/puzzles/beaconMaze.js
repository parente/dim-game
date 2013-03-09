define([
    'jquery',
    'dim/topic',
    'dim/controllers/dpad'
], function($, topic, DPad) {
    var exports = {};

    var cls = function(world, ctrlId) {
        // stash unmodified controller data
        this.origCtrl = world.get_ctrl(ctrlId);
        // deep copy the controller data because prompt will be modified
        this.ctrl = $.extend(true, {}, this.origCtrl),
        // pull out prompt template and other often accessed props
        this.promptTemplate = this.ctrl.prompt[0];
        // compute beacon
        this.beacon = null;

        // find the beacon cell id
        for(var i=0,l=this.ctrl.cells.length; i < l; i++) {
            var cell = this.ctrl.cells[i];
            if(cell.beacon) {
                this.beacon = cell;
                break;
            }
        }

        // error if beacon is null
        if(!this.beacon) {
            throw new Error('no cell with "beacon" property: ' + ctrlId);
        }

        // find the beacon in the layout
        for(var row=0; row<this.ctrl.layout.length; row++) {
            for(var col=0; col<this.ctrl.layout[row].length; col++) {
                if(this.ctrl.layout[row][col] === this.beacon.id) {
                    this.beacon.location = [row, col];
                    break;
                }
            }
        }

        // error if beacon.location is undefined
        if(!this.beacon.location) {
            throw new Error('no beacon cell in layout: ' + ctrlId);
        }

        // compute open paths as options
        this.ctrl.options = this.build_options();
        // compute the prompt and include the audio beacon
        this.ctrl.prompt = [this.build_prompt()];

        // build dpad as menu
        this.menu = new DPad(this.ctrl);
        // watch for selections
        this.menu.on_select = $.proxy(this, 'on_select');
    };

    cls.prototype.on_select = function() {
        var opt = this.menu.get_current(),
            row = this.ctrl.location[0],
            col = this.ctrl.location[1];

        // update location based on direction
        if(opt.id === 'up') {
            row--;
        } else if(opt.id === 'down') {
            row++;
        } else if(opt.id === 'left') {
            col--;
        } else if(opt.id === 'right') {
            col++;
        }

        // get new cell type, should never be out of bounds
        var cell = this.get_cell(row, col);

        // update locations
        if(!cell.repel) {
            this.ctrl.location = [row, col];
            if(this.ctrl.persistLocation) {
                this.origCtrl.location = [row, col];
            }
        }

        if(cell.fire) {
            // fire cell events and clean up
            var events = world.evaluate.apply(world, cell.fire);
            events.fire();
            topic('controller.complete').publish(this);
        } else {
            // set next options and prompt, then repeat repeat
            this.ctrl.options = this.build_options();
            this.ctrl.prompt = [this.build_prompt()];
            this.menu.reset(this.ctrl);
        }
    };

    cls.prototype.destroy = function() {
        this.menu.destroy();

        // stop the beacon audio
    };

    cls.prototype.get_cell = function(row, col, oob) {
        var cells = this.ctrl.cells,
            layout = this.ctrl.layout,
            id = layout[row] ? layout[row][col] : undefined;

        if(id === undefined) {
            // out of bounds
            return oob;
        }

        for(var i=0, l=cells.length; i < l; i++) {
            if(cells[i].id === id) {
                return cells[i];
            }
        }
        return {};
    };

    cls.prototype.build_options = function() {
        var row = this.ctrl.location[0],
            col = this.ctrl.location[1],
            layout = this.ctrl.layout,
            opts = {},
            def = {impassable: true};


        // compute open paths
        if(!this.get_cell(row-1, col, def).impassable) {
            opts.up = true;
        }
        if(!this.get_cell(row+1, col, def).impassable) {
            opts.down = true;
        }
        if(!this.get_cell(row, col-1, def).impassable) {
            opts.left = true;
        }
        if(!this.get_cell(row, col+1, def).impassable) {
            opts.right = true;
        }

        // filter original options array so it only includes open paths
        return $.grep(this.origCtrl.options, function(opt) {
            return opt.id in opts;
        });
    };

    cls.prototype.build_prompt = function() {
        // TODO: use the report map instead of hardcoding?
        var prompt = $.extend(true, {}, this.promptTemplate),
            reports = [prompt],
            visual = $.map(this.ctrl.options, function(opt) {
                var name = opt.visual.name;
                return name ? name : '';
            }),
            aural = $.map(this.ctrl.options, function(opt) {
                return {narration: opt.aural.name};
            });
        if(prompt.description) {
            prompt.description += ' ' + visual.join(', ');
        }
        if(prompt.narration) {
            reports = reports.concat(aural);
        }
        return reports;
    };

    exports.create = function(world, ctrlId) {
        // easier to do this one OO style
        return new cls(world, ctrlId);
    };

    return exports;
});