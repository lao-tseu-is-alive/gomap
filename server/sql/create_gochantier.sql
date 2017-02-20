DROP TABLE IF EXISTS public.gochantier;
DROP SEQUENCE public.gochantier_idgochantier_seq;
DROP INDEX geoobject_idgeoobjects_uindex;

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
  planified_datestart        DATE,
  planified_dateend          DATE,
  real_datestart        DATE,
  real_dateend          DATE
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

INSERT INTO gochantier(nom,description,idcreator,
                      planified_datestart,planified_dateend,
                      real_datestart,real_dateend,
                       geom_polygon)
    VALUES ('Chantier de test numéro 1', 'Ceci est juste une chantier de test', 7,
            '2017-02-22', '2017-03-15', NULL, NULL,
            st_geomfromtext('POLYGON(( 537629.3 152622.2,
                              537627.1 152616.1,
                              537636.3 152612.5,
                              537638.6 152618.6,
                              537629.3 152622.2))', 21781)
    )
