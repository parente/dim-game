// build overrides with specific version #
if (typeof DIM_VERSION === 'undefined') DIM_VERSION = (new Date()).getTime();

requirejs.config({
    baseUrl: 'js/vendor',
    urlArgs: "v=" + DIM_VERSION,
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