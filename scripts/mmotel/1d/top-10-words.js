// run: mongo text top-10-words.js

var coll = db.text;

var result = coll.aggregate(
  { $group: {_id: "$word", count: {$sum: 1}} },
  { $sort: {count: -1} },
  { $limit: 10 } 
);

printjson(result);

var totalCount = 0;

for(var i = 0; i < result.result.length; i++){
	totalCount += result.result[i].count;
}

var wordsCount = coll.count();

print(" słów: " + i);
print("ilość: " + totalCount);
print("część: " + (totalCount / wordsCount) * 100 + "%");