#!/bin/bash
fixjsstyle src/main.js
gjslint src/main.js
../node_modules/.bin/closure-util build config.json app.js
du -h app.js


