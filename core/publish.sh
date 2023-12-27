#!/bin/bash
rm -rf dist
mkdir dist

cp . ./dist


# GET VERSION from mck_package.json
VERSIONSTRING=( v$(jq .version package.json) )
VERSION=(${VERSIONSTRING//[\"]/})
echo VERSION: $VERSION

#ingore babel demo files

# mv ./babel.config.js ./babel.config.js.temp
# mv ./mck_babel.config ./babel.config.js

rsync -r --verbose --exclude '*.mdx' --exclude '*Demo.js'  --exclude 'props-type.js' --exclude 'prop-types.js' ./* dist

#babel component to dist
#babel ./dist -d dist --copy-files

#copy option
#cp -r ./src/ dist

# npm login
#publish dist to npm
cd dist
npm publish --access=public

#clear dist and package json
cd ..
rm -rf dist


curl -X POST -H 'Content-Type: application/json' 'https://chat.googleapis.com/v1/spaces/AAAAbP8987c/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=UGSFRvk_oYb9uGsAgs31bVvMm6jDkmD8zihGm3eyaQA%3D&threadKey=JoaXTEYaNNkl' -d '{"text": "@momo-kits/core new version release: '*"$VERSION"*' https://www.npmjs.com/package/@momo-kits/core"}'
