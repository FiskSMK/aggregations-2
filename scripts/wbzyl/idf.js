// for each word compute inverse document frequencies

// Array.unique – http://api.mongodb.org/js/current/index.html

m = function() {
  // Array.unique(this.words).forEach(function(word) {
  this.words.forEach(function(word) {
    emit(word, 1);
  });
};

r = function(key, values) {
  return Array.sum(values);
};

db.idf.drop();

db.so.mapReduce(m, r, {out: "idf"});

// db.idf.find().sort({value: -1}).limit(6);
