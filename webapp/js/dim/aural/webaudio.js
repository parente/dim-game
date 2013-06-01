define(['dim/topic'], function(topic) {
    var exports = {},
        soundProtocol = 'sound://',
        context,
        compressor,
        encoded_buffers,
        decoded_buffers,
        ext,
        max_cache = 25;

    var load_audio = function(world) {
        var loaded = new $.Deferred(),
            uris = world.get_media_uris(soundProtocol),
            downloaded = 0;

        // for every uri in the world media set
        $.each(uris, function(i, uri) {
            // do not reload if already loaded
            if(encoded_buffers[uri]) {
                // check if all files have been received
                if(++downloaded === uris.length) {
                    loaded.resolve();
                }
                return;
            }

            // convert the uri to a full url
            var url = world.media_uri_to_url(uri+ext),
                request;

            // jquery balks at arraybuffer type
            // so do it the raw way
            request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            request.onload = function() {
                if(!request.response) {
                    loaded.reject();
                    return;
                }
                // store the encoded audio
                encoded_buffers[uri] = request.response;
                // check if all files have been received
                if(++downloaded === uris.length) {
                    loaded.resolve();
                    return;
                }
                // notify about load progress
                topic('controller.initializing').publish(downloaded / uris.length);
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

    var decode_audio = function(uri) {
        var def = new $.Deferred(),
            cache = decoded_buffers._cache,
            old_uri,
            old_index;

        // check if cached
        if(decoded_buffers[uri]) {
            // get current index of uri
            old_index = cache.indexOf(uri);
            // console.debug('old_index', old_index);
            // slice the uri out of the cache stack
            decoded_buffers._cache = cache = cache.slice(0, old_index).concat(cache.slice(old_index+1));
            // put it at the top
            cache.unshift(uri);
            // console.debug(cache);

            // console.debug('returning cached decode:', uri);
            def.resolve(decoded_buffers[uri]);
            return def;
        }

        // decode new and cache
        context.decodeAudioData(encoded_buffers[uri], function(buffer) {
            cache.unshift(uri);
            if(cache.length > max_cache) {
                old_uri = cache.pop();
                if(old_uri !== uri) {
                    delete decoded_buffers[old_uri];
                }
            }
            // console.debug(cache);
            decoded_buffers[uri] = buffer;
            def.resolve(buffer);
        }, function() {
            def.reject();
        });
        return def;
    };

    var play_audio = function(uri, buffer, props, def) {
        var audioSource = context.createBufferSource(),
            gainNode = null,
            pannerNode = null,
            prior,
            timer;
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
        // console.debug('**** starting audio output:', uri);
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
    };

    var first_initialize = function() {
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
        encoded_buffers = {};
        decoded_buffers = {_cache: []};

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
    };

    exports.initialize = function(world) {
        if(!context) {
            first_initialize();
        }
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
        // console.debug('**** resolving deferred on stop:', def.msg, def.state());
    };

    exports.play = function(uri, props) {
        var def = new $.Deferred();
        // store the buffer uri for later reference
        def.msg = uri;
        // store the props for later reference
        def.props = props;
        decode_audio(uri).then(function(buffer) {
            // only continue with playback if the deferred is still unresolved
            // otherwise, do nothing
            if(def.state() === 'pending') {
                play_audio(uri, buffer, props, def);
            }
        }, function() {
            console.warn('webaudio: skipping audio after failure to decode: ', uri);
            def.resolve();
        });
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