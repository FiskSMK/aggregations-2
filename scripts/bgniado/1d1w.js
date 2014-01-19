var coll = db.text;

var res = coll.aggregate(
  { $group: {_id: "$word", count: {$sum: 1}} },
  { $sort: {count: -1} },
  //{ $limit: 1 }
  //{ $limit: 10 }
  //{ $limit: 100 }
  { $limit: 1000 }
);

var agregWords = 0;

for(var i = 0; i < res.result.length; i++){
        agregWords += res.result[i].count;
}

var allWords = coll.count();
var percent = (agregWords / allWords) * 100;

print("Ilość liczonych słów: " + i);
print("Znaleziono " + agregWords + " takich słów, co stanowi " + percent + "% wszystkich słów w bazie.");