var coll = db.text;

var res = coll.aggregate(
  { $group: {_id: "$word", count: {$sum: 1}} } 
);

var aggregWords = 0;

for(var i = 0; i < res.result.length; i++){
        aggregWords += res.result[i].count;
}

var allWords = coll.count();
var percent = (aggregWords / allWords) * 100;

print("Ilość liczonych słów: " + i);
print("Znaleziono " + aggregWords + " takich słów, co stanowi " + percent + "% wszystkich słów w bazie.");