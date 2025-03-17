#!/bin/sh

# Update everything (just in case)
npm rebuild
rm -rf node_modules .tmp
npm install --no-optional

# Built and test
grunt --production --pullTransifex --pushTransifex --noTest

