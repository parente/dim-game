// build overrides with a blank string
if (typeof CACHE_BUST_VERSION === 'undefined') CACHE_BUST_VERSION = "bust=" + (new Date()).getTime();

requirejs.config({
    baseUrl: 'js/vendor',
    urlArgs: CACHE_BUST_VERSION,
    paths : {
        dim : '../dim'
    },
    shim : {
        'jquery' : {
            exports: 'jQuery'
        },
        'jquery.doubletap': {
            deps: ['jquery']
        },
        'jquery.getobject': {
            deps: ['jquery']
        }
    }
});

// not ordered
require(['dim/devel', 'dim/main']);