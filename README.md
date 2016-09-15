# gomap
using openlayers 3 to display a map that uses WMTS from Lausanne

[ol3_02_wmtsmap.html is a basic map using OL3 and one colorfoul WMTS layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_02_wmtsmap.html)

the previous page was not optimal from a performance point of view as you can see on Google PageSpeed
[Google PageSpeed Test Results](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Frawgit.com%2Flao-tseu-is-alive%2Fgomap%2Fmaster%2Fol3_02_wmtsmap.html&tab=desktop)
 
So let's try to offer the same functionality but in a more cleaner way using  [browserify](http://browserify.org/)

./node_modules/.bin/browserify app.js -o bundle.js


## Some Openlayers 3 useful links
[Creating custom builds of OL3](http://openlayers.org/en/latest/doc/tutorials/custom-builds.html)
[Discussion on OpenLayers 3 about using Browserify](https://github.com/openlayers/ol3/issues/3162)
