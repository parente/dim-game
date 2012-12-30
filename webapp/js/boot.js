requirejs.config({
    baseUrl: 'js/vendor',
    urlArgs: "bust=" +  (new Date()).getTime(),
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