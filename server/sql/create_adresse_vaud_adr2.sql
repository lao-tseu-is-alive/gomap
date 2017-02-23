CREATE TABLE adresse_vaud_adr2
(
    egid INTEGER NOT NULL,
    edid SMALLINT NOT NULL,
    canton CHAR(2) NOT NULL,
    ofs_commune SMALLINT NOT NULL,
    commune_abrege TEXT,
    nom_batiment TEXT,
    estrid INTEGER,
    rue TEXT,
    entree TEXT,
    code INTEGER,
    num_postal INTEGER,
    num_postal_complement SMALLINT,
    lieu TEXT,
    coord_x_mn95 INTEGER,
    coord_y_mn95 INTEGER,
    coord_x_mn03 INTEGER,
    coord_y_mn03 INTEGER,
    provenance_coord SMALLINT,
    date_mutation DATE,
    date_exportation DATE,
    CONSTRAINT adresse_vaud_adr2_pk PRIMARY KEY (egid, edid)
);

SELECT addgeometrycolumn('adresse_vaud_adr2', 'geom_point', 21781, 'POINT', 2, TRUE);
/* you can insert data from adr2 files here with 3 steps
1: convert from ISO-8859-1 to utf8:
   iconv -f ISO-8859-1 -t utf-8  21022017_ADR2.txt >21022017_ADR2_UTF8.txt
2: remove the .000 from the coords in mn95
   sed -i -- 's/\.000//g' 21022017_ADR2_UTF8.txt
3: insert the data directly into table with copy from
  SQL="COPY adresse_vaud_adr2 FROM '/tmp/21022017_ADR2_UTF8.txt' WITH NULL AS '' ;"
  su -c "psql -c '${SQL} gomap " postgres
 */


UPDATE adresse_vaud_adr2
  SET geom_point =
  st_geomfromtext( 'POINT (' || (coord_x_mn03)::TEXT || ' ' || (coord_y_mn03)::TEXT || ')',21781);
-- UPDATE spatial index
CREATE INDEX adresse_vaud_adr2_idx_gist ON adresse_vaud_adr2 USING GIST (geom_point);
SELECT COUNT(*) FROM adresse_vaud_adr2 WHERE geom_point IS NULL
--DELETE FROM adresse_vaud_adr2 WHERE coord_x_mn03 IS NULL


SELECT coalesce(rue,'') || ' ' ||  coalesce(entree,'') || ' , ' || coalesce(num_postal::TEXT,'') || ' ' || coalesce(commune_abrege,'')
  FROM adresse_vaud_adr2
    WHERE commune_abrege ILIKE '%lausanne%'

/* FULL TEXT SEARCH POSTGRES
input_string := translate(input_string, 'âãäåāăąÁÂÃÄÅĀĂĄ', 'aaaaaaaaaaaaaaa');
input_string := translate(input_string, 'èééêëēĕėęěĒĔĖĘĚ', 'eeeeeeeeeeeeeee');
input_string := translate(input_string, 'ìíîïìĩīĭÌÍÎÏÌĨĪĬ', 'iiiiiiiiiiiiiiii');
input_string := translate(input_string, 'óôõöōŏőÒÓÔÕÖŌŎŐ', 'ooooooooooooooo');
input_string := translate(input_string, 'ùúûüũūŭůÙÚÛÜŨŪŬŮ', 'uuuuuuuuuuuuuuuu');


 */

-- now let's add a text search field
ALTER TABLE adresse_vaud_adr2 ADD COLUMN textsearch tsvector;
UPDATE adresse_vaud_adr2 SET textsearch = to_tsvector('french',
  coalesce(unaccent(rue),'') || ' ' ||  coalesce(unaccent(entree),'') || ' , ' || coalesce(num_postal::TEXT,'') || ' ' || coalesce(unaccent(commune_abrege),'')
);
DROP INDEX adresse_vaud_adr2_idx_gin_textsearch
CREATE INDEX adresse_vaud_adr2_idx_gin_textsearch ON adresse_vaud_adr2 USING GIN (textsearch);
VACUUM ANALYSE adresse_vaud_adr2
-- on prend que les villes qui sont dans perimetre lidar
ALTER TABLE adresse_vaud_adr2 ADD COLUMN Lidar2012BB BOOLEAN DEFAULT FALSE;
UPDATE adresse_vaud_adr2 SET Lidar2012BB = TRUE
WHERE ofs_commune IN (
  SELECT DISTINCT ofs_commune
  FROM adresse_vaud_adr2
  WHERE geom_point && st_setsrid('BOX3D(532500 149000, 545625 161000)' :: BOX3D, 21781)
)
SELECT count(*), Lidar2012BB
FROM adresse_vaud_adr2
GROUP BY Lidar2012BB

-- let's copy this subset in another specific table
/*
UPDATE adresse_region_lausanne_adr2 SET textsearch = to_tsvector('french',
  coalesce(unaccent(rue),'') || ' ' ||  coalesce(unaccent(entree),'') || ' , ' || coalesce(num_postal::TEXT,'') || ' ' || coalesce(unaccent(commune_abrege),'')
);

 */
SELECT * INTO adresse_region_lausanne_adr2 FROM adresse_vaud_adr2 WHERE Lidar2012BB = True
CREATE INDEX adresse_region_lausanne_adr2_idx_gist ON adresse_region_lausanne_adr2 USING GIST (geom_point);
DROP INDEX aadresse_region_lausanne_adr2_idx_gin_textsearch
CREATE INDEX aadresse_region_lausanne_adr2_idx_gin_textsearch ON adresse_region_lausanne_adr2 USING GIN (textsearch);


GRANT ALL ON TABLE public.adresse_vaud_adr2 TO GROUP gomap_admin WITH GRANT OPTION;
GRANT ALL ON TABLE public.adresse_region_lausanne_adr2 TO GROUP gomap_admin WITH GRANT OPTION;



--exemple query for autocomplete
SELECT egid,edid, rue, entree, commune_abrege FROM adresse_vaud_adr2
WHERE textsearch @@ to_tsquery('bois & 12')

SELECT array_to_json(array_agg(f)) AS json_data
FROM (
  SELECT
    egid :: TEXT || '-' || edid                                             AS id,
    coalesce(rue, '') || ' ' || coalesce(entree, '') || ' , ' ||
    coalesce(num_postal :: TEXT, '') || ' ' || coalesce(commune_abrege, '') AS label
  FROM adresse_vaud_adr2
  WHERE textsearch @@ to_tsquery('cheseau')
) as f

SELECT
    --egid :: TEXT || '-' || edid                                             AS id,
    rue,entree, commune_abrege
  FROM adresse_vaud_adr2
  WHERE textsearch @@ to_tsquery('geneve & 4')


SELECT COUNT(*), commune_abrege
  FROM adresse_vaud_adr2
WHERE geom_point && st_setsrid('BOX3D(532500 149000, 545625 161000)'::box3d, 21781)
GROUP BY commune_abrege
ORDER BY 2


--- EXEMPLE DE QUERY VIDE
SELECT array_to_json(array_agg(f)) AS json_data
FROM (
  SELECT
    coord_x_mn03::TEXT || '_' || coord_y_mn03 AS id,
    coalesce(rue, '') || ' ' || coalesce(entree, '') || ' , ' ||
    coalesce(num_postal :: TEXT, '') || ' ' || coalesce(commune_abrege, '') AS label
  FROM adresse_region_lausanne_adr2
  WHERE textsearch @@ to_tsquery('éco:* & 1:*')
) as f;

SELECT array_to_json(array_agg(f)) AS json_data
FROM (
  SELECT
    coord_x_mn03::TEXT || '_' || coord_y_mn03 AS id,
    coalesce(rue, '') || ' ' || coalesce(entree, '') || ' , ' ||
    coalesce(num_postal :: TEXT, '') || ' ' || coalesce(commune_abrege, '') AS label
  FROM adresse_region_lausanne_adr2
  WHERE rue ILIKE ('%GENE%') AND num_postal ILIKE ('1091')
) as f;
SELECT rue, textsearch FROM adresse_region_lausanne_adr2 WHERE rue ILIKE ('%GENE%')