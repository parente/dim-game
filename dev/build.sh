#!/bin/bash
VERSION=$1
DEVEL=$2
if [ -z $VERSION ]; then
    echo "usage: build.sh <version number> [enable devel?]"
    exit 1
fi

if [ -z $DEVEL ]; then
    DEVEL="false"
else
    DEVEL="true"
fi

echo "==> VERSION: $VERSION"
echo "==> DEVEL: $DEVEL"

# clean up old version if it exists
rm -r "../webapp.build"

# spit out a build config with the desired version number
# can't use file descriptor trick because r.js wants to be
# relative to a real file, so write a real one
cat << END > webapp.build.js
({
    appDir: "../webapp",
    dir: "../webapp.build",
    // seed the build config with the runtime options
    //mainConfigFile: "../webapp/js/boot.js",
    baseUrl: 'js/vendor',
    // add the runtime config as a module itself
    paths : {
        boot: '../boot',
        dim : '../dim'
    },
    // remove individual files
    removeCombined: true,
    // point to the bootloader as the root of the scripts to build
    modules: [
        {
            name: "boot",
            include: [
                "dim/controllers/explore/explore",
                "dim/controllers/explore/examine",
                "dim/controllers/explore/move",
                "dim/controllers/explore/take",
                "dim/controllers/explore/use",
                "dim/controllers/meta/boot",
                "dim/controllers/meta/done",
                "dim/controllers/meta/save",
                "dim/controllers/puzzles/beaconMaze",
                "dim/controllers/puzzles/memoryPattern",
                "dim/controllers/puzzles/timedReact"
            ]
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
            DEVEL: ['name', '$DEVEL'],
            // do no cache busting in built copy
            // assume new versions are in entirely new folders (disk is cheap)
            DIM_VERSION: ['string', '$VERSION']
        }
    },
    preserveLicenseComments: false,
    throwWhen: {
        // throw error instead of skipping bad JS
        optimize: true
    }
})
END

# do the build
node r.js -o webapp.build.js