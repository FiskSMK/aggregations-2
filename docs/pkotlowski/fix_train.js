var database = db.train.find();
var tagsCounter = 0;
var tagCollection ={};
database.forEach(function (item){
  
  if(item.Tags.constructor === String){
    var tagsArray = [];
    tagsArray = item.Tags.split(" ");   //Rodzielanie stringa jako separator spacja
    
    tagsArray.forEach(function(tag){
        if(typeof tagCollection[x] !== 'number'){
            tagCollection[tag] = 1;
        }
        else{
            tagCollection[tag]++;
        } 
    })
          
    tagsCounter = tagsCounter + tagsArray.length;
     
    db.train.update(
                     { id: item.id },
                     { $set: { Tags: tagsArray } }
                   )
        
  }

});

print("Razem tagów: " + tagsCounter);
print("Unikalnych tagów: " + tagCollection.length)
