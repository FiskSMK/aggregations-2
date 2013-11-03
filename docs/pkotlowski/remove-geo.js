var records = db.geo_points.find();
var counter = 0;
cursor2.forEach(function (point){

        if( point.loc.coordinates[1].constructor !== Number || point.loc.coordinates[0].constructor !== Number){
                db.geo_points.remove({id: point.id});
                count++;
                printjson(point.id);
        }

});
print(counter);