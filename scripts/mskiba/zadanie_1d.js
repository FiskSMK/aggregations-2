// mongo --eval "var ilosc=10" zadanie_1d.js

var wynik = db.Text.aggregate(
    { $group: {_id: "$slowo", count: {$sum:1}} },
    { $sort: {count: -1} },
    { $limit: ilosc }
)

var wszystkich = db.Text.count();
var suma = 0;
for(var i=0; i<wynik.result.length; i++) {
    suma += wynik.result[i].count;
}

var procent = 100*(suma/wszystkich);

if(ilosc == 1)
    print("Najczęściej występujące słowo stanowi " + procent.toFixed(2) + "% całej kolekcji");
else
    print(ilosc + " najczęściej występujących słów stanowi " + procent.toFixed(2) + "% całej kolekcji");
