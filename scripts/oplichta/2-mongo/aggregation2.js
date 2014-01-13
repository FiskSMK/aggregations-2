// run: time mongo imdb aggregation2.js

var collection = db.imdb;

var result = collection.aggregate(
  { $match: { "modelName": "movies"  } },
  { $group: {_id: "$title", ilosc: {$sum: 1} } },
  { $sort: { ilosc: -1} },
  { $limit: 20}
);

printjson(result);