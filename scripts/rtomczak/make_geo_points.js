var mongo = db.allstates.find().addOption(DBQuery.Option.noTimeout);


var counter =0;

mongo.forEach(function (record){

        var point = {
                "id": record["FEATURE_ID"],
                "name": record["FEATURE_NAME"],
		        "type": record["FEATURE_CLASS"],
				"state_alpha": record["STATE_ALPHA"],
		        "county_name": record["COUNTY_NAME"],
		        "height_in_m": record["ELEV_IN_M"],
				"height_in_ft": record["ELEV_IN_FT"],
				"map_name": record["MAP_NAME"],
                "loc": { "type":"Point", "coordinates": [ record["PRIM_LONG_DEC"] , record["PRIM_LAT_DEC"] ] }
        };
	
         db.allstates_geo.insert(point);
counter++;

});
print(counter);