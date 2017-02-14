SELECT COUNT(*) as nombre,
  t.idtypething,
  tt.name
FROM thing t
  LEFT JOIN type_thing tt on tt.idtypething=t.idtypething
  WHERE tt.b4internet = TRUE
GROUP BY t.idtypething,tt.name
ORDER BY nombre DESC