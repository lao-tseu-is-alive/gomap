#!/usr/bin/env bash
echo "retrievieng ADR2 file"
TODAY=`date -I`
TODAY_UNDERSCORE=`date +%Y_%m_%d`
cd /tmp
mount -t cifs //geodata.lausanne.ch/data/ /mnt/geodata_public/  -o credentials=/root/.MyAuthentications/cifs_trx.txt
cp /mnt/geodata_public/cadastre/000_Interlis_VD/ADR2_VAUD/ADR2_21022017.zip .
unzip ADR2_21022017.zip
iconv -f ISO-8859-1 -t utf-8  21022017_ADR2.txt >21022017_ADR2_UTF8.txt
sed -i -- 's/\.000//g' 21022017_ADR2_UTF8.txt
SQL="COPY adresse_vaud_adr2 FROM '/tmp/21022017_ADR2_UTF8.txt' WITH NULL AS '' ;"
su -c "psql -c '${SQL} gomap " postgres
