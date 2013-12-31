//Rafał Łuczun

var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
  if (err) {
    console.log(err);
  } else {
    
    db.collection('movies', function(err, collection) {
      collection.aggregate([
        { $match: { modelName: "movies" , director: { $exists: true, $nin: ['various directors', 'not available'] } } },
        { $group: {_id: "$director", titles: {$addToSet: "$title"} } },
        { $unwind: "$titles" },
        { $group: {_id: "$_id", count: {$sum: 1} } },
        { $sort: {count: -1 } },
        { $limit: 10}],
        function (err, items) {
          for(var i = 0; i < 10; i++) {
            console.log(items[i].count + " movies \t" + items[i]._id)
          }
          db.close();
        });
    });
  }
});  
