scp /home/cgil/WebstormProjects/gomap/*.html qgis-ovh.lausanne.ch:/var/www/cgtest-trouvelinfo/html/
scp /home/cgil/WebstormProjects/gomap/bundle.js  qgis-ovh.lausanne.ch:/var/www/cgtest-trouvelinfo/html/
rsync -av  /home/cgil/WebstormProjects/gomap/css  qgis-ovh.lausanne.ch:/var/www/cgtest-trouvelinfo/html/
rsync -av  /home/cgil/WebstormProjects/gomap/js  qgis-ovh.lausanne.ch:/var/www/cgtest-trouvelinfo/html/
rsync -av  /home/cgil/WebstormProjects/gomap/images  qgis-ovh.lausanne.ch:/var/www/cgtest-trouvelinfo/html/
ssh  qgis-ovh.lausanne.ch  /bin/minify_javascript_gomap.sh
