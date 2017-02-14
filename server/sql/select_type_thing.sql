select
    tt.idtypething,
    tt."name",
    tt.tablename,
    tt.thedefault,
    tt.typegeometrie,
    tt.b4internet,
    tt.datecreated,
    tt.description,
    tt."flag",
    tt.iconeurl,
    tt.idcreator,
    tt.idmanagerthing,
    tt.infotypeurl,
    tt.isactive,
    tt.maxidentity
from
    type_thing tt
order by name;

