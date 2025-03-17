#!/bin/sh

# Update everything (just in case)
npm rebuild
npm install --no-optional
grunt clean
# Built and test
grunt --production --pullTransifex --pushTransifex --noTest

