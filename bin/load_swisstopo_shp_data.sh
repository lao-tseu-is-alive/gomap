#!/usr/bin/env bash
mkdir /tmp/swisstopo
cd /tmp/swisstopo
cp /home/cgil/geodata/swisstopo/2017/BOUNDARIES_2017/DATEN/swissBOUNDARIES3D/SHAPEFILE_LV03_LN02/* .
shp2pgsql -i -S -W LATIN1 -d -s 21781 -I -N abort swissBOUNDARIES3D_1_3_TLM_HOHEITSGEBIET communes_swisstopo   gomap > swissboundaries3d_1_3_tlm_hoheitsgebiet.sql
su postgres -c 'psql -f swissboundaries3d_1_3_tlm_hoheitsgebiet.sql gomap'
su postgres -c 'psql -c "GRANT SELECT ON TABLE communes_swisstopo TO public;" gomap'
su postgres -c 'psql -c "GRANT ALL ON TABLE communes_swisstopo TO gomap_admin WITH GRANT OPTION;" gomap'
shp2pgsql -i -S -W LATIN1 -d -s 21781 -I -N abort swissBOUNDARIES3D_1_3_TLM_KANTONSGEBIET cantons_swisstopo   gomap > swissboundaries3d_1_3_tlm_kantonsgebiet.sql
su postgres -c 'psql -f swissboundaries3d_1_3_tlm_kantonsgebiet.sql gomap'
su postgres -c 'psql -c "GRANT SELECT ON TABLE cantons_swisstopo TO public;" gomap'
su postgres -c 'psql -c "GRANT ALL ON TABLE cantons_swisstopo TO gomap_admin WITH GRANT OPTION;" gomap'
