define(function() {
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
                    // console.log(decoded);
                    // decrement the number of decodes outstanding
                    if(++decoded == uris.length) {
                        loaded.resolve();
                    }
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
        // disconnect the audio source
        var audioSource = def.audioSource;
        audioSource.noteOff(0);
        audioSource.disconnect();
        if(def.gainNode) {
            // and the optional gain node
            def.gainNode.disconnect();
        }
        // resolve the deferred
        def.resolve();
    };

    exports.play = function(uri, props) {
        var def = new $.Deferred(),
            buffer = buffers[uri],
            audioSource = context.createBufferSource(),
            gainNode = null,
            timer;
        // store the buffer uri for later reference
        def.msg = uri;
        if(props.loop) {
            audioSource.loop = true;
        }
        audioSource.buffer = buffer;
        // if we want to adjust gain, build a gain node and connect
        // source -> gain -> compressor
        if(props.gain) {
            gainNode = context.createGainNode();
            gainNode.gain.value = props.gain;
            audioSource.connect(gainNode);
            gainNode.connect(compressor);
            def.gainNode = gainNode;
        } else {
            // otherwise connect source -> compressor
            audioSource.connect(compressor);
        }
        def.audioSource = audioSource;
        // start the audio playing
        audioSource.noteOn(0);
        // disconnect nodes after completion to avoid leaks if not looping
        if(!props.loop) {
            timer = setTimeout(function() {
                audioSource.disconnect();
                if(gainNode) {
                    gainNode.disconnect();
                }
                delete def.timer;
                def.resolve(this);
            }, buffer.duration * 1000);
            def.timer = timer;
        } else {
            // resolve immediately for looping sounds
            def.resolve();
        }
        return def;
    };

    exports.can_play = function(msg) {
        return msg && msg.search(soundProtocol) === 0;
    };

    exports.is_playing = function() {
        return def ? def.msg : null;
    };

    return exports;
});