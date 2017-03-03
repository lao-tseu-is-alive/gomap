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
  identiteleader   INTEGER,
  entiteleader     TEXT,
  id_affaire_goeland INTEGER,
  participants      TEXT,
  isactive         BOOLEAN DEFAULT TRUE  NOT NULL,
  dateinactivation TIMESTAMP,
  isdeleted       BOOLEAN DEFAULT FALSE NOT NULL,
  dateisdeleted   TIMESTAMP,
  isvalidated      BOOLEAN DEFAULT FALSE NOT NULL,
  iduservalidator  INTEGER,
  datevalidation   TIMESTAMP,
  planified_datestart        DATE NOT NULL,
  planified_dateend          DATE NOT NULL,
  real_datestart        DATE,
  real_dateend          DATE
);
CREATE UNIQUE INDEX gochantier_idgochantier_uindex
  ON gochantier (idgochantier);

SELECT addgeometrycolumn('gochantier', 'geom_point', 21781, 'POINT', 2, TRUE);
SELECT addgeometrycolumn('gochantier', 'geom_line', 21781, 'LINESTRING', 2, TRUE);
SELECT addgeometrycolumn('gochantier', 'geom_polygon', 21781, 'MULTIPOLYGON', 2, TRUE);

ALTER TABLE public.gochantier
  ADD properties_data JSONB NULL;

GRANT SELECT ON TABLE public.gochantier TO public;
GRANT ALL ON TABLE public.gochantier TO GROUP gomap_admin WITH GRANT OPTION;
GRANT USAGE ON SEQUENCE public.gochantier_idgochantier_seq TO gomap_admin;

INSERT INTO gochantier(nom,description,idcreator,
                      planified_datestart,planified_dateend,
                      real_datestart,real_dateend,
                      entiteleader,id_affaire_goeland,
                       participants,
                       geom_polygon)
    VALUES ('Renens - Rue du Cauderay (chantier pour démo)', 'renouvellement des réseaux d''eau (distribution) et de gaz', 7,
            '2017-03-13', '2017-05-31', '2017-03-13', '2017-05-31',
            'BGR eau potable (EAU) Lausanne',274002,
            '<table class="table table-striped table-bordered table-hover">
	<thead>
		<td>Métier</td>
		<td>Participation</td>
		<td>En date du</td>
		<td>Description des travaux prévus</td>
	</thead>
	<tr>
		<td>Routes et mobilité</td>
		<td>non</td>
		<td>02.03.2017</td>
		<td><br></td>
	</tr>
	<tr>
		<td>EAU-évacuation</td>
		<td>non</td>
		<td>01.03.2017</td>
		<td><br></td>
	</tr>
	<tr>
		<td>EAU-distribution</td>
		<td>oui</td>
		<td>01.03.2017</td>
		<td>renouvellement de la conduite DN150 et de tous les raccordements aux bâtimentsrenouvellement de la conduite DN150 et de tous les raccordements aux bâtiments</td>
	</tr>
	<tr>
		<td>GAZ</td>
		<td>oui</td>
		<td>01.03.2017</td>
		<td>renouvellement du raccord au bâtiment n°5renouvellement du raccord au bâtiment n°5</td>
	</tr>
	<tr>
		<td>Chauffage à distance</td>
		<td>non</td>
		<td>01.03.2017</td>
		<td><br></td>
	</tr>
	<tr>
		<td>Electricité-réseau</td>
		<td>non</td>
		<td>01.03.2017</td>
		<td><br></td>
	</tr>
	<tr>
		<td>Electricité-éclairage public</td>
		<td>non</td>
		<td>01.03.2017</td>
		<td><br></td>
	</tr>
	<tr>
		<td>Multimédia</td>
		<td>non</td>
		<td>01.03.2017</td>
		<td><br></td>
	</tr>
</table>',
            st_geomfromtext('MULTIPOLYGON(((534767.55 153756.45,534765.15 153753.65,534745.55 153767.95,534731.55 153774.05,534711.15 153777.95,534691.95 153777.35,534666.35 153770.65,534665.75 153775.55,534670.85 153776.45,534675.85 153777.75,534680.95 153779.55,534685.35 153780.65,534692.25 153781.95,534699.55 153782.55,534704.95 153782.65,534717.45 153781.85,534732.65 153777.95,534738.45 153775.65,534744.35 153773.15,534750.75 153769.55,534756.25 153765.85,534767.55 153756.45)),((534668.55 153770.9,534671.45 153762.3,534672.35 153762.65,534669.4 153771.15,534668.55 153770.9)),((534699.25 153777.2,534698.95 153768.6,534701 153768.55,534701.3 153777.3,534699.25 153777.2)),((534749.4 153764.75,534744.4 153755.85,534742.85 153756.65,534742.4 153755.6,534744.75 153754.55,534750.1 153764.25,534749.4 153764.75)))', 21781)
    )
