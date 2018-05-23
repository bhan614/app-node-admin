#!/bin/sh

source /etc/profile
rm -rf ./dist/ && mkdir ./dist
cp -R ./bin/ ./dist/bin/ && cp -R ./public/ ./dist/public/ && cp -R ./server/ ./dist/server/
rm -rf ./dist/public/dll/ && chmod -R a+x ./dist/bin/
cp -R ./node_modules/ ./dist/node_modules/
cp ./Config.js  ./dist/