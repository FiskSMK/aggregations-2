
db.tdidf.drop();

var N = db.so.count();

db.so.find().forEach(function (doc) {
  var freq = doc.freq;
  var max = doc.max;
  doc.tdidf = {};

  for (word in freq) { 
    var n = db.idf.find({_id: word}).count();
    var tdidf = freq[word]/max * Math.LOG2E * Math.log(N/n);

    doc.tdidf[word] = tdidf;
  }
  delete doc.freq;
  delete doc.max;

  // printjson(doc);
  db.tdidf.insert(doc);

});
