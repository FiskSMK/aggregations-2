var mongo = require('mongodb');

var db = new mongo.Db('train', new mongo.Server('localhost', 27017), {safe: true});

var tagsCount = 0;
var itemsCount = 0;
var updatesCount = 0;
var updatedCount = 0;
var tags = {};
var diffTags = 0;

var flushData = function (data){

  db.collection('train2', function (err, coll) {
    if(err){
      db.close();
      console.log(err);
    }
    else{
      coll.insert(data, function (err, item) {
        updatedCount += data.length;
        if(updatedCount % 10000 === 0 || updatesCount === 6034195){
          console.log('Wykonano ' + updatedCount + " aktualizacji.");
        }
      });
    }
  });

};

db.open(function (err) {
  if(err){ console.log(err); }
  else{
    console.log('MongoDB Połączono!');

    db.collection('train', function (err, coll) {
      if(err){
        db.close();
        console.log(err);
      }
      else{
        var cursor = coll.find();
        var tagsToUpdate = [];

        cursor.each(function(err, item) {
          if(err){
            db.close();
            console.log(err);
          }
          else if(item === null){
              //czekamy aż mongo zakończy update-y
              var interval = setInterval( function(){
                if(updatesCount !== updatedCount){
                  console.log("Czekam na wszystkie update-y... \t " + updatedCount + "\\" + updatesCount);
                }
                else{
                  clearInterval(interval);
                  db.close();
                  console.log("Update-y zakończone.");
                  console.log('MongoDB Rozłączone!');
                  console.log("ilość obiektów: " + itemsCount);
                  console.log("ilość updateów: " + updatesCount);
                  console.log(" ilość tagów: " + tagsCount);
                  console.log(" różnych tagów: " + diffTags);
                }
              }, 1000);
          }
          else{
            itemsCount++;

            if(item.Tags.constructor !== Array){
              var tagsSplited = [];

              if(item.Tags.constructor === String){
                tagsSplited = item.Tags.split(" "); //rozdzielamy string do tablicy
              } else {
                tagsSplited.push(item.Tags);
              }

              tagsCount += tagsSplited.length;
              //zliczanie różnych tagów
              for(var i=0; i < tagsSplited.length; i++){
                if(tags[tagsSplited[i]] === undefined){
                  tags[tagsSplited[i]] = 1; //cokolwiek byle pole było defined
                  diffTags++;
                }
                else{
                 tags[tagsSplited[i]]++;
                }
              }
              item.Tags = tagsSplited;

              tagsToUpdate.push(item);
              
              updatesCount++; //liczymy ilość update-ów do wykonania

              if(updatesCount % 1000 === 0 || updatesCount === 6034195){
                flushData(tagsToUpdate);
                tagsToUpdate = [];
              }
            }

            if(itemsCount % 10000 === 0){
              console.log("obiektów: " + itemsCount + " aktualizacji: " + updatesCount +
              " tagów: " + tagsCount + " różnych tagów: " + diffTags);
            }
          }
        });
      }
    });
  }
});
