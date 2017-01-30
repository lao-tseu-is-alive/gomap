#!/bin/bash
cd js
yui-compressor ol3-layerswitcher.js -o ol3-layerswitcher-min.js 
yui-compressor goeland_ol3_wmts.js -o goeland_ol3_wmts-min.js 
cd ..
