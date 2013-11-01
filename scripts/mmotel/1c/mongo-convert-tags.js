//run: mongo train mongoScript.js

db.train2.drop();

var cursor = db.train.find();

var trainCount = db.train.count();

var itemCount = 0;
var updatesCount = 0;
var tagsCount = 0;
var diffTagsCount = 0;
var tags = {};
var items = [];

cursor.forEach(function (item){
  itemCount++;
  if(item.Tags.constructor !== Array){
    updatesCount++;
    var tagsSplited = [];

    if(item.Tags.constructor === String){
      tagsSplited = item.Tags.split(" "); //rozdzielamy string do tablicy
    } else {
      tagsSplited.push(item.Tags);
    }
    item.Tags = tagsSplited; //podmieniamy tagi

    //zliczamy tagi
    tagsCount += tagsSplited.length;

    for(var i=0; i < tagsSplited.length; i++){
      if(tags[tagsSplited[i]] === undefined){
        tags[tagsSplited[i]] = 1;
        diffTagsCount++;
      }
      else{
       tags[tagsSplited[i]]++;
      }
    }
    //insert do nowej kolekcji

    items.push(item);

    if(itemCount % 1000 === 0 || itemCount === trainCount){
      db.train2.insert(items);
      items = [];
    }
  }

  // if(itemCount % 1000 === 0){
  //   print("     obiektów:" + itemCount);
  //   print(" aktualizacji:" + updatesCount);
  //   print("        tagów:" + tagsCount);
  //   print("różnych tagów:" + diffTagsCount);
  // }

});

print("     obiektów:" + itemCount);
print(" aktualizacji:" + updatesCount);
print("        tagów:" + tagsCount);
print("różnych tagów:" + diffTagsCount);

var one = db.train2.findOne();
printjson(one);
