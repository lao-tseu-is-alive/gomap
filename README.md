# gomap

Code samples to use Openlayers 3 to display a map that uses various WMTS Tiles from Lausanne as base Layer

[ol3_01_osm_basemap.html is a very simple map using OL3 and OpenStreetMap layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_01_osm_basemap.html)

[ol3_02_wmtsmap.html is a basic map using OL3 and one colorfoul WMTS layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_02_wmtsmap.html)

[ol3_03_wmts_layerswitcher.html is using a layer switcher to choose from one of various WMTS layer](https://rawgit.com/lao-tseu-is-alive/gomap/master/ol3_03_wmts_layerswitcher.html)


[Google PageSpeed Test Results](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Frawgit.com%2Flao-tseu-is-alive%2Fgomap%2Fmaster%2Fol3_02_wmtsmap.html&tab=desktop)
 

# using async for better performance

the previous pages are all using the complete OpenLayers3 library hosted on a CDN,
from a performance point of view as you can see gtmetrix and on Google PageSpeed that the speed it is not optimal
Let's assume we want to enhance progressively the performance of the ol3_02_wmtsmap.html, 
first by using async and a couple of minor changes but still using the complete library on CDN
and then doing a special version of the app and compiling it with Closure Compile to reduce the size of the library. 
[perfomance compared on those 3 versions side by side ](https://gtmetrix.com/compare/CvqZZq6j/e4Opj1ST/LWm7fwQN/Doy8fvwF)

As you can see we got A grade for all our versions, all our page versions load in less then 0.5 sec. 
but the async version is a clear winner  6% better compared to the original version !

The special crafted and carrefully coded version for the Closure Compiler versions is slower,
 and I spend some hard time figuring how to make it compile/work, the total page size is half the weight of the previous version
 but it doesn not have a great influence on the score.
Believe me the async with a library on CDN is a much easy path ! 

[62/100 Mobile Speed On Google PageSpeed for the original version](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fcgtest.trouvl.info%2Fol3_02_wmtsmap.html)
[71/100 Mobile Speed for the async version ](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fcgtest.trouvl.info%2Fol3_02_wmtsmap_async.html&tab=mobile)
[71/100 Mobile Speed for the special compiled version ](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fcgtest.trouvl.info%2Fapp.html&tab=mobile)



You can also try to use [browserify](http://browserify.org/) or other identical tools to pack all your javascript code in a bundle
basic usage is explained in [this page](http://openlayers.org/en/latest/doc/tutorials/browserify.html) : 

./node_modules/.bin/browserify first.js second.js -o bundle.js



here is the result of custom compiling the above example ol3_02_wmtsmap.html
[Google PageSpeed after compiling](https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fcgtest.trouvl.info%2Fapp.html&tab=mobile)


## Some Openlayers 3 useful links
[OpenLayers 3 Examples](http://openlayers.org/en/latest/examples/)

[Creating custom builds of OL3](http://openlayers.org/en/latest/doc/tutorials/custom-builds.html)

[Discussion on OpenLayers 3 about using Browserify](https://github.com/openlayers/ol3/issues/3162)

[OpenLayers 3 LayerSwitcher plugin](https://github.com/walkermatt/ol3-layerswitcher)

[compile our application and OpenLayers 3 together](http://openlayers.org/en/latest/doc/tutorials/closure.html)
