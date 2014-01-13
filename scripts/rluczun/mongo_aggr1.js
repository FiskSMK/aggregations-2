//Rafał Łuczun

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    
    db.collection('movies', function(err, collection) {
      collection.aggregate([
        { $match: { comment: { $exists: true } } },
        { $group: {_id: "$userId", comments: {$addToSet: "$comment"} } },
        { $unwind: "$comments" },
        { $group: {_id: "$_id", count: {$sum: 1} } },
        { $sort: {count: -1 } },
        { $limit: 10}],
        function (err, items) {
          for(var i = 0; i < 10; i++) {
            console.log(items[i].count + ' comments written by ' + items[i]._id);
          }
          db.close();
        });
    });
  }
});  
