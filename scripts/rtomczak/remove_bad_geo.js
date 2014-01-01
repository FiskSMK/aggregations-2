var records = db.allstates_geo.find().addOption(DBQuery.Option.noTimeout);
var counter = 0;
records.forEach(function (point){

        if( point.loc.coordinates[1].constructor !== Number || point.loc.coordinates[0].constructor !== Number){
                db.allstates_geo.remove({id: point.id});
                counter++;
                printjson(point.id);
        }

});
print(counter);