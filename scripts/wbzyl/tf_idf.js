db.tfidf.drop();

var N = db.so.count();

db.so.find().forEach(function (doc) {
  var freq = doc.freq;
  var max = doc.max;
  doc.tfidf = {};

  for (word in freq) { 
    var n = db.idf.find({_id: word});
    // skip infrequent words
    if (n.value > 44) {
      doc.tfidf[word] = freq[word]/max * Math.LOG2E * Math.log(N/n.value);;
    }
  }
  delete doc.freq;
  delete doc.max;
  // printjson(doc);

  db.tfidf.insert(doc);
});
