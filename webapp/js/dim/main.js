define([
    'jquery',
    'dim/world',
    'dim/input',
    'dim/visual',
    'dim/aural',
    'dim/topic',
    'dim/pump',
    'dim/devel'
], function($, world, input, visual, aural, topic, pump) {
    var controller;

    var activate_controller = function(fn, args) {
        console.log('main.activate_controller', fn, args);
        if(controller) {
            controller.destroy();
            controller = null;
        }
        // load, track, and publish input controller
        require([fn], function(factory) {
            // decouple
            setTimeout(function() {
                controller = factory.create(world, args);
                if(!controller) {
                    // go back to default
                    topic('controller.request').publish();
                }
            }, 0);
        });
    };

    var on_controller_request = function(fn, args) {
        console.log('main.on_controller_request', fn);
        activate_controller(fn || world.get_default('controller'), args);
    };

    var on_controller_complete = function(inst) {
        console.log('main.on_controller_complete', inst === controller);
        if(controller == inst) {
            // switch to the default controller if no other controller was
            // activated in the meantime
            on_controller_request();
        }
    };

    var start = function() {
        topic('controller.request').subscribe(on_controller_request);
        topic('controller.complete').subscribe(on_controller_complete);

        console.log('main.initializing');
        // initialize all components, pump first so it has the ability to block
        // events from reaching other components
        var pd = pump.initialize(),
            wd = world.initialize(),
            id = input.initialize(wd),
            vd = visual.initialize(wd),
            ad = aural.initialize(wd);

        console.log('main.pending_initialized');
        // when all controllers ready
        $.when(pd, wd, id, vd, ad).then(function() {
            console.log('main.initialized');
            topic('controller.initialized').publish();
            // prime the game pump
            pump.start(world, [aural, visual]);
            // move the player to the initial scene
            var scene = world.get_player_scene();
            var events = world.evaluate('move', scene);
            events.fire();
            topic('controller.request').publish(scene.controller);
        });
    };

    $(start);
});