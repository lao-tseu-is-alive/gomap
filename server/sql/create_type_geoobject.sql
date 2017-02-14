-- DROP TABLE public.type_geoobject;
CREATE TABLE public.type_geoobject
(
    idtypegeoobject INT PRIMARY KEY NOT NULL,
    nom TEXT NOT NULL,
    description TEXT,
    datecreated TIMESTAMP DEFAULT now(),
    idcreator INTEGER NOT NULL,
    datelastmodif TIMESTAMP,
    iduserlastmodif INTEGER,
    isactive BOOLEAN DEFAULT true NOT NULL,
    dateinactivation TIMESTAMP,
    iconeurl text,
    infotypeurl text,
    typegeometrie text,
    proprerties_field_info JSONB
);
CREATE UNIQUE INDEX type_geoobject_idtypegeoobject_uindex ON public.type_geoobject (idtypegeoobject)