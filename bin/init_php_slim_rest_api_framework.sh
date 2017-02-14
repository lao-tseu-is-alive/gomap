source bin/install_php_composer.sh
cd server/
php ../bin/composer.phar create-project slim/slim-skeleton gomap-api
cd gomap-api/
echo "<?php phpinfo() ?>" >public/cginfo.php
sudo chown www-data:users logs/*
php -S 0.0.0.0:9090 -t public public/index.php

