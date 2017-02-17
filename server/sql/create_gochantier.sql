DROP TABLE IF EXISTS public.gochantier;
--DROP SEQUENCE public.gochantier_idgochantier_seq;
--DROP INDEX geoobject_idgeoobjects_uindex;

CREATE SEQUENCE public.gochantier_idgochantier_seq
INCREMENT 1
MINVALUE 1
MAXVALUE 9223372036854775807
START 1
CACHE 1;
ALTER TABLE public.gochantier_idgochantier_seq
  OWNER TO postgres;
CREATE TABLE gochantier
(
  idgochantier      INTEGER PRIMARY KEY   NOT NULL DEFAULT nextval('public.gochantier_idgochantier_seq' :: REGCLASS),
  nom              TEXT                  NOT NULL,
  description      TEXT,
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
CREATE UNIQUE INDEX gochantier_idgochantier_uindex
  ON gochantier (idgochantier);

SELECT addgeometrycolumn('gochantier', 'geom_point', 21781, 'POINT', 2, TRUE);
SELECT addgeometrycolumn('gochantier', 'geom_line', 21781, 'LINESTRING', 2, TRUE);
SELECT addgeometrycolumn('gochantier', 'geom_polygon', 21781, 'POLYGON', 2, TRUE);

ALTER TABLE public.gochantier
  ADD properties_data JSONB NULL;

GRANT SELECT ON TABLE public.gochantier TO public;
GRANT ALL ON TABLE public.gochantier TO GROUP gomap_admin WITH GRANT OPTION;
GRANT USAGE ON SEQUENCE public.gochantier_idgochantier_seq TO gomap_admin;
