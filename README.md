# gomap

Code samples to use Openlayers 3 to display a map that uses various WMTS Tiles from Lausanne as base Layer

[ol3_01_osm_basemap.html is a very simple map using OL3 and OpenStreetMap layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_01_osm_basemap.html)

[ol3_02_wmtsmap.html is a basic map using OL3 and one colorfoul WMTS layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_02_wmtsmap.html)

[ol3_03_wmts_layerswitcher.html is using a layer switcher to choose from one of various WMTS layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_03_wmts_layerswitcher.html)

the previous pages are all using the complete OpenLayers3 library from a CDN,
from a performance point of view as you can see on Google PageSpeed it is not optimal
[Google PageSpeed Test Results](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Frawgit.com%2Flao-tseu-is-alive%2Fgomap%2Fmaster%2Fol3_02_wmtsmap.html&tab=desktop)
 
We can try to offer the same functionality but in a more cleaner way using  [browserify](http://browserify.org/)
basic usage is like this : 

./node_modules/.bin/browserify app.js -o bundle.js

Next posssible step is to make a custom build of the OpenLayers library using only what we really need,
as explained on the [OpenLayers 3 website](http://openlayers.org/en/latest/doc/tutorials/custom-builds.html) 


## Some Openlayers 3 useful links
[Creating custom builds of OL3](http://openlayers.org/en/latest/doc/tutorials/custom-builds.html)

[Discussion on OpenLayers 3 about using Browserify](https://github.com/openlayers/ol3/issues/3162)
