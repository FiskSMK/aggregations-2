var mongo = require('mongodb');
var db = new mongo.Db('mydb', new mongo.Server('localhost', 27017), {safe: true});

var allTags = 0;
var updates = 0;
var updated = 0;
var tags = {};
var uniTags = 0;

db.open(function (err) {
  if(err){ console.log(err); }
  else{
    db.collection('things', function (err, things) {
	
      if(err){
        db.close();
        console.log(err);
      }
      else{
        var thing = things.find();
        var updatesTab = [];

        thing.each(function(err, item) {
          if(err){
            db.close();
            console.log(err); 
          }
          else if(updated === 6034195){
                  db.close();
                  console.log("--==Done==--");
                  console.log("    Updated: " + updated);
                  console.log("       Tags: " + allTags);
                  console.log("Unique Tags: " + uniTags);
                }
          else{
            if(item.tags.constructor !== Array){  
              var tagsSplited = [];

              if(item.tags.constructor === String){
                item.tags = item.tags.split(" ");
              } else {
                item.tags = [item.tags];
              }

              allTags += item.tags.length;
              
              for(var i=0; i < item.tags.length; i++){
                if(tags[item.tags[i]] === undefined){
                  tags[item.tags[i]] = 1;
                  uniTags++;
                }
                else{
                 tags[item.tags[i]]++;
                }
              }

              updatesTab.push(item);  
              updates++;

              if(updates % 3000 === 0 || updates === 6034195){
                for(var i=0; i<updatesTab.length; i++){
					things.update({_id : updatesTab[i]["_id"]}, {$set:{tags: updatesTab[i].tags}}, function (err, item) {
					        updated++;
					});
				};
                updatesTab = [];
              }
            }

            if(updates % 10000 === 0){
              console.log("Converted: " + updates + "Updated: " + updated + " | All Tags: " + allTags + " | Different Tags: " + uniTags + " | Progress: " + Math.floor(updates/6034195*100)+"%");
            }
          }
        });
      }
    });
  }
});
