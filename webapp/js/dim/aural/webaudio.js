define(['dim/topic'], function(topic) {
    var exports = {},
        soundProtocol = 'sound://',
        context,
        compressor,
        buffers,
        ext;

    var load_audio = function(world) {
        var loaded = new $.Deferred(),
            uris = world.get_media_uris(soundProtocol),
            decoded = 0;

        // for every uri in the world media set
        $.each(uris, function(i, uri) {
            // convert the uri to a full url
            var url = world.media_uri_to_url(uri+ext),
                request;

            // jquery balks at arraybuffer type
            // so do it the raw way
            request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                // handle the audio data
                var on_decode = function(buffer) {
                    // fail if buffer is null
                    if(!buffer) {
                        loaded.reject();
                        return;
                    }
                    // otherwise store the buffer
                    buffers[uri] = buffer;
                    // decrement the number of decodes outstanding
                    if(++decoded == uris.length) {
                        loaded.resolve();
                    }
                    // note load progress
                    topic('controller.initializing').publish(decoded / uris.length);
                };
                var on_error = function() {
                    // fail outright on error
                    loaded.reject();
                };
                // TODO: maybe do this closer to time of use if this is a bottleneck?
                // try to decode what we've loaded
                context.decodeAudioData(request.response, on_decode, on_error);
            };
            request.onerror = function() {
                // fail outright on request error
                loaded.reject();
            };
            // send the request
            request.send();
        });

        // return a deferred result
        return loaded;
    };

    exports.initialize = function(world) {
        // make sure we support the web audio api
        try {
            context = new webkitAudioContext();
        } catch(e) {
            throw new Error('webkitAudioContext not supported');
        }

        // build a dynamic compressor
        compressor = context.createDynamicsCompressor();
        compressor.connect(context.destination);
        compressor.threshold.value = -40;
        compressor.ratio.value = 15;

        // start with new buffers
        buffers = {};

        // figure out audio type supported
        var node = new Audio();
        if(node.canPlayType('audio/ogg') && node.canPlayType('audio/ogg') !== 'no') {
            ext = '.ogg';
        } else if(node.canPlayType('audio/mpeg') && node.canPlayType('audio/mpeg') !== 'no') {
            ext = '.mp3';
        } else {
            throw new Error('no known audio format supported');
        }

        // TODO: need to do something like this on an event for iOS to bless audio
        //      disabled after addition of compressor until I can retest what's needed
        // var audioSource = context.createBufferSource();
        // audioSource.connect(context.destination);
        // audioSource.noteOn(0);
        // audioSource.disconnect(0);

        // load all audio and notify ready
        return $.when(world).then(load_audio);
    };

    exports.stop = function(def) {
        // if no deferred, we're not playing
        if(!def) return;
        // stop any timeout
        clearTimeout(def.timer);
        // stop the audio
        if(def.nodes) {
            def.nodes.sourceNode.noteOff(0);
            for(var key in def.nodes) {
                def.nodes[key].disconnect();
            }
            delete def.nodes;
        }
        // resolve the deferred
        def.resolve();
    };

    exports.play = function(uri, props) {
        var def = new $.Deferred(),
            buffer = buffers[uri],
            audioSource = context.createBufferSource(),
            gainNode = null,
            pannerNode = null,
            prior,
            timer;
        // store the buffer uri for later reference
        def.msg = uri;
        // store the props for later reference
        def.props = props;
        // store the nodes for disconnect() later, source first
        def.nodes = {sourceNode: audioSource};

        if(props.loop) {
            audioSource.loop = true;
        }
        audioSource.buffer = buffer;
        prior = audioSource;

        // if we want to position the source, build a panner and connect
        if(props.location) {
            pannerNode = context.createPanner();
            pannerNode.setPosition(props.location[0], props.location[1], props.location[2]);
            prior.connect(pannerNode);
            def.nodes.pannerNode = pannerNode;
            prior = pannerNode;
        }

        // if we want to adjust gain, build a gain node and connect
        if(props.gain) {
            gainNode = context.createGainNode();
            gainNode.gain.value = props.gain;
            prior.connect(gainNode);
            def.nodes.gainNode = gainNode;
            prior = gainNode;
        }

        // make final connection to the compressor which is hooked to the output
        prior.connect(compressor);

        // start the audio playing
        audioSource.noteOn(0);

        // disconnect nodes after completion to avoid leaks if not looping or swapstopping
        if(!props.loop && !props.swapstop) {
            timer = setTimeout(function() {
                for(var key in def.nodes) {
                    def.nodes[key].disconnect();
                }
                delete def.nodes;
                delete def.timer;
                def.resolve(this);
            }, buffer.duration * 1000);
            def.timer = timer;
        } else {
            // resolve after returning the deferred for looping sounds or swapstopping sounds
            setTimeout(function() { def.resolve(); }, 0);
        }
        return def;
    };

    exports.update = function(def, props) {
        if(def.nodes.pannerNode && props.location) {
            def.nodes.pannerNode.setPosition(props.location[0], props.location[1], props.location[2]);
        }
        if(def.nodes.gainNode && props.gain) {
            def.nodes.gainNode.gain.value = props.gain;
        }
    };

    exports.can_play = function(msg) {
        return msg && msg.search(soundProtocol) === 0;
    };

    exports.is_playing = function() {
        return def ? def.msg : null;
    };

    return exports;
});