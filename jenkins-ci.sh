#!/bin/sh -xe
npm install .
node_modules/.bin/gulp #&& node_modules/.bin/gulp closure
node_modules/.bin/gulp test
