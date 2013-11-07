//Rafał Łuczun

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    var allWords = 0;
    db.collection('words', function(err, collection) {
      collection.aggregate([
        { $group: {_id: "$word", count: {$sum: 1}} },
        { $sort: {count: -1} }],
        function (err, items) {
          for(var i = 0; i < items.length; i++) {
            allWords += items[i].count;
          }
          console.log('\n-------------------\nTOP 1000\n-------------------\n')
          for(i = 0; i < 1000; i++) console.log(items[i]._id);
          console.log('\n-------------------\nTOP 100\n-------------------\n');
          for(i = 0; i < 100; i++) console.log(items[i]._id);
          console.log('\nAll words: ' + allWords + '\nUnique words: ' + items.length +
                      '\nUnique as part of all: ' + ((items.length/allWords)*100).toFixed(2) + '%' +
                      '\n-------------------\nTOP 10\n-------------------\n');
          for(i = 0; i < 10; i++) console.log(items[i]._id);
          
          
          db.close();
        });
    });
  }
});  
