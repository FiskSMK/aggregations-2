trains = db.train.find();

var tagsUnikalne = {};
var tagsIlosc = 0;

trains.forEach(function(train){
    var tagsArray = [];

    // zamieniamy string zawierający tagi na tablicę napisów z tagami 
    if(typeof train.tags === "string") {
        tagsArray = train.tags.split(" "); 
        db.Train.update({_id: train._id}, {$set: {tags: tagsArray}});
    } else if(typeof train.tags === "number") {
        // tag jest liczbą
        tagsArray.push(train.tags.toString());
        db.Train.update({_id: train._id}, {$set: {tags: tagsArray}});
    } else {
        // tag jest już tablicą
        tagsArray = train.tags;
    }

    // zliczamy wszystkie tagi
    tagsIlosc += tagsArray.length;

    // zliczamy wszystkie różne tagi
    tagsArray.forEach(function(tag) {
        if(typeof tagsUnikalne[tag] === "undefined") 
            tagsUnikalne[tag] = 1;
    });
});

print("Wszystkie tagi: " + tagsIlosc);
print("Unikalne tagi: " + Object.keys(tagsUnikalne).length);
