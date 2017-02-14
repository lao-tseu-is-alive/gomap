#!/usr/bin/env bash
su -c "createdb gomap" postgres
su -c "psql -c 'CREATE EXTENSION postgis' gomap" postgres