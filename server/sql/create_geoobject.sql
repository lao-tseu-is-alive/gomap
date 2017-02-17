DROP TABLE IF EXISTS public.geoobject;
--DROP SEQUENCE public.geoobject_idgeoobject_seq;
--DROP INDEX geoobject_idgeoobjects_uindex;

CREATE SEQUENCE public.geoobject_idgeoobject_seq
INCREMENT 1
MINVALUE 1000000
MAXVALUE 9223372036854775807
START 1000001
CACHE 1;
ALTER TABLE public.geoobject_idgeoobject_seq
  OWNER TO postgres;
CREATE TABLE geoobject
(
  idgeoobject      INTEGER PRIMARY KEY   NOT NULL DEFAULT nextval('public.geoobject_idgeoobject_seq' :: REGCLASS),
  idtypegeoobject  INTEGER               NOT NULL,
  nom              TEXT                  NOT NULL,
  description      TEXT,
  iconeurl         TEXT,
  infourl          TEXT,
  datecreated      TIMESTAMP                      DEFAULT now(),
  idcreator        INTEGER               NOT NULL,
  datelastmodif    TIMESTAMP,
  iduserlastmodif  INTEGER,
  isactive         BOOLEAN DEFAULT TRUE  NOT NULL,
  dateinactivation TIMESTAMP,
  isvalidated      BOOLEAN DEFAULT FALSE NOT NULL,
  iduservalidator  INTEGER,
  datevalidation   TIMESTAMP,
  datestart        DATE,
  dateend          DATE
);
CREATE UNIQUE INDEX geoobject_idgeoobjects_uindex
  ON geoobject (idgeoobject);

SELECT addgeometrycolumn('geoobject', 'geom_point', 21781, 'POINT', 2, TRUE);
SELECT addgeometrycolumn('geoobject', 'geom_line', 21781, 'LINESTRING', 2, TRUE);
SELECT addgeometrycolumn('geoobject', 'geom_polygon', 21781, 'POLYGON', 2, TRUE);

ALTER TABLE public.geoobject
  ADD properties_data JSONB NULL;

GRANT SELECT ON TABLE public.geoobject TO public;
GRANT ALL ON TABLE public.geoobject TO GROUP gomap_admin WITH GRANT OPTION;
GRANT USAGE ON SEQUENCE public.geoobject_idgeoobject_seq TO gomap_admin;
