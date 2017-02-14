#!/usr/bin/env bash
echo "backup of gomap db"
TODAY=`date -I`
TODAY_UNDERSCORE=`date +%Y_%m_%d`
cd /tmp
su -c "pg_dump --format=c  -f /tmp/gomap_${TODAY}.backup gomap" postgres
echo "copy backup of gomap db to myvps"
scp /tmp/gomap_${TODAY}.backup myvps:/tmp/
echo "restore backup of gomap db to myvps"
ssh myvps bin/restoredb_gomap.sh
