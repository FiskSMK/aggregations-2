// mongo --quiet --shell kaggle facebook.js

db.fb.drop();

// var cursor = db.facebook.find().limit(4);

var cursor = db.facebook.find();

cursor.forEach(function(x) {
  // printjson(x.tags);

  if (typeof x.tags === "string") {
    var a = x.tags.trim().split(/\s+/);
    delete x.tags;
    x.tags = a;
    x.rnd = Math.random();

    db.fb.insert(x);
  } else {
    // skip record without tags
  }
})

var one= db.fb.findOne();
printjson(one);

db.fb.ensureIndex({"rnd": 1});
