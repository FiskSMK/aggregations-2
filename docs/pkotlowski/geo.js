var mongo = db.geo.find();


var counter =0;

mongo.forEach(function (record){

        var point = {
                "id": record["FEATURE_ID"],
                "name": record["FEATURE_NAME"],
		        "type": record["FEATURE_CLASS"],
		        "country_name": record["COUNTRY_NAME"],
		        "height": record["ELEV_IN_M"],
                "loc": { "type":"Point", "coordinates": [ record["PRIM_LONG_DEC"] , record["PRIM_LAT_DEC"] ] }
        };
	
         db.geo_points.insert(point);
counter++;

});
print(counter);
