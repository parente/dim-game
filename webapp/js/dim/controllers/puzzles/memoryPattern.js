define([
    'dim/topic',
    'dim/controllers/menu',
    'dim/controllers/dpad'
], function(topic, Menu, DPad) {
    var exports = {};

    exports.create = function(world, ctrlId) {
        // get pattern artifacts
        var ctrl = world.get_ctrl(ctrlId),
            choice = 0,
            attempt = 0,
            correct = true,
            menu;

        var on_activate = function() {
            var key = menu.get_selected(),
                events;
            // check if next input matches matter or not
            correct &= (key.id === ctrl.correct[choice]);
            choice++;

            // have input for every piece of pattern
            if(choice >= ctrl.correct.length) {
                if(correct) {
                    // if all pieces match, solve
                    events = world.evaluate('solve', ctrlId);
                    events.fire();
                    topic('controller.complete').publish(menu);
                } else if(!ctrl.maxAttempts || attempt < ctrl.maxAttempts-1) {
                    // if any piece does not match and have not
                    // failed too many times, retry
                    attempt++;
                    choice = 0;
                    correct = true;
                    events = world.evaluate('retry', ctrlId);
                    events.fire();
                    menu.reset();
                } else {
                    // fail completely
                    events = world.evaluate('fail', ctrlId);
                    events.fire();
                    topic('controller.complete').publish(menu);
                }
            } else {
                // keep sequence, advance to next prompt
                menu.next();
            }
        };

        // allow use of the dpad or menu input scheme
        if(ctrl.inputScheme && ctrl.inputScheme.toLowerCase() === 'dpad') {
            menu = new DPad(ctrl);
            menu.on_select = on_activate;
        } else {
            menu = new Menu(ctrl);
            menu.on_activate = on_activate;
        }

        if(ctrl.canAbort) {
            menu.on_abort = function() {
                topic('controller.complete').publish(menu);
            };
        }
        // just use the menu as the controller to track
        return menu;
    };

    return exports;
});