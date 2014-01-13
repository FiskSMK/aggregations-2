// run: time mongo imdb aggregation1.js

var collection = db.imdb;

var result = collection.aggregate(
  { $group: {_id: "$action", ilosc: {$sum: 1}} },
  { $sort: {ilosc: -1} }
);

print("Łącznie akcji: " + result.result.length);

printjson(result);