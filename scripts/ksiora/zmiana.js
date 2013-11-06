var cursor = db.geo.find();
var licznikZmian =0;

cursor.forEach(function(dokument){
	var punkt = {
		"id" : dokument["FEATURE_ID"],
		"nazwa" : dokument["FEATURE_NAME"],
		"typ" : dokument["FEATURE_CLASS"],
		"loc" : { "type" : "Point", "coordinates" : [ dokument["PRIM_LONG_DEC"], dokument["PRIM_LAT_DEC"] ]
		}
	};
  if( dokument["PRIM_LONG_DEC"].constructor == Number && dokument["PRIM_LAT_DEC"].constructor == Number){
	  db.geo2.insert(punkt);
	  licznikZmian++;
  }
});
print("Dokonano zmian - " + licznikZmian);
