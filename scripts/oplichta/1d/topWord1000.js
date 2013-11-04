// run: mongo text topWord.js

var collection = db.text;

var result = collection.aggregate(
  { $group: {_id: "$slowa", count: {$sum: 1}} },
  { $sort: {count: -1} },
  { $limit: 1000} 
);

printjson(result);

var zliczone = 0;

for(var i = 0; i < result.result.length; i++){
        zliczone += result.result[i].count;
}

var wszystkie = collection.count();

print(" słów: " + i);
print("ilość: " + zliczone);
print("część: " + (zliczone / wszystkie) * 100 + "%");