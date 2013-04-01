#!/bin/bash
VERSION=$1
if [ -z $VERSION ]; then
    echo "usage: build.sh <version number>"
    exit 1
fi

# clean up old version if it exists
rm -r "../webapp.build.${VERSION}"

# build to an isolated, versioned directory
node r.js -o webapp.build.js dir="../webapp.build.${VERSION}"
