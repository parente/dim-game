({
    appDir: "../webapp",
    dir: "../webapp-build",
    // seed the build config with the runtime options
    mainConfigFile: "../webapp/js/boot.js",
    // add the runtime config as a module itself
    paths : {
        boot: '../boot'
    },
    // point to the bootloader as the root of the scripts to build
    modules: [
        {
            name: "boot"
        }
    ],
    uglify: {
        defines: {
            // disable developer debugging tools
            DEVEL: ['name', 'false']
        }
    },
    preserveLicenseComments: false,
    throwWhen: {
        //If there is an error calling the minifier for some JavaScript,
        //instead of just skipping that file throw an error.
        optimize: true
    }
})
