db.zad1c.drop();

var item = db.train.find();

var trainCount = db.train.count();
var scannedObjects = 0;
var updatedObjects = 0;
var tags = {};
var records = [];

item.forEach(function (record){
  scannedObjects++;
  if (record.Tags.constructor != Array){
    updatedObjects++;
    var tagsArray = [];
    if (record.Tags.constructor == String){
      tagsArray = record.Tags.split(" ");
    } else {
      tagsArray.push(record.Tags);
    }
    record.Tags = tagsArray;
    for(var i=0; i < tagsArray.length; i++){
      if(tags[tagsArray[i]] === undefined){
        tags[tagsArray[i]] = 1;
      }
      else{
       tags[tagsArray[i]]++;
      }
      db.zad1c.insert(record);
    }
  }
});

print("przeskanowane obiekty: " + scannedObjects);
print("zaktualizowane obiekty:" + updatedObjects);

printjson(db.zad1c.findOne());
