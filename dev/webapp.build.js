({
    appDir: "../webapp",
    dir: "../webapp-build",
    // seed the build config with the runtime options
    //mainConfigFile: "../webapp/js/boot.js",
    baseUrl: 'js/vendor',
    // add the runtime config as a module itself
    paths : {
        boot: '../boot',
        dim : '../dim'
    },
    // point to the bootloader as the root of the scripts to build
    modules: [
        {
            name: "boot"
        }
    ],
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
    },
    uglify: {
        defines: {
            // disable developer debugging tools
            DEVEL: ['name', 'false'],
            // do no cache busting in built copy
            // assume new versions are in entirely new folders (disk is cheap)
            CACHE_BUST_VERSION: ['string', '']
        }
    },
    preserveLicenseComments: false,
    throwWhen: {
        // throw error instead of skipping bad JS
        optimize: true
    }
})
