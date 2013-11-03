db.geoal.drop();


var cursor = db.al.find();

cursor.forEach(function (item){

        var geo = {
                "id": item["FEATURE_ID"],
                "name": item["FEATURE_NAME"],
                "loc": { "type":"Point", "coordinates": [ item["PRIM_LONG_DEC"] , item["PRIM_LAT_DEC"] ] }
        };

        //print(item["FEATURE_ID"] + " : [ " + item["PRIM_LONG_DEC"] + " , " + item["PRIM_LAT_DEC"] + " ]");

        db.geoal.insert(geo);

});

var cursor2 = db.geoal.find();
var count = 0;
cursor2.forEach(function (item){

        if(item.loc.coordinates[0].constructor !== Number || item.loc.coordinates[1].constructor !== Number){
                db.geoal.remove(item);
                count++;
                printjson(item);
        }

});

print(count);