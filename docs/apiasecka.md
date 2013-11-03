#Aleksandra Piasecka i Karolina Rybarczyk

##Wstęp:
parametry:
```
8GB ramu
Intel(R) Core(TM) i3-2130 CPU @ 3.40GHz
```

#Zadanie 1a
Aby pozbyć się niepotrzebnych `\n` skorzystałam z polecenia:
```
cat Train.csv |tr -d '\n'|sed 's/\r/\r\n/g' > TTrain.csv
```

a następnie tak przygotowany plik `.csv` zaimportowałam do mongo przy pomocy polecenia:
```
time mongoimport --collection Train --type csv --file TTrain.csv --headerline
```

###Czas:
```
real    8m16.170s
user    1m13.513s
sys     0m14.593s
```

#Zadanie 1b
```
db.Train.count();
6034195
```

#Zadanie 1d
Na początku plik został przygotowany według wskazówek do zadania.

Import do bazy:
```
time mongoimport --type csv --fields 'slowa' --collection text  --port 12121 < text8.txt 
```

```
Czas:
real        7m57.252s
user        0m46.171s
sys        0m5.532s
```

Ilość wszystkich słów:
```
wc -l text8.txt
17005207 text8.txt
```
lub
```
db.text.count();
17005207
```

Ilość różnych słów:
```
db.text.aggregate({$group: {_id: "$slowa", count: {$sum: 1}}}, {$group: {_id: null, count: {$sum: 1}}})
{ "result" : [ { "_id" : null, "count" : 253854 } ], "ok" : 1 }
```
wynik: 253854

###top1:
```
db.text.aggregate({$group: {_id: "$slowa", count: {$sum: 1}}}, {$sort: {count:-1}}, {$limit: 1})
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
```
najczęściej tystępuje słowo `THE`
```
całość: 17005207
wynik: 1061396
%: 6,24%
```

###top10:
```
db.text.aggregate(	{$group: {_id: "$slowa", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 10}, 
					{ $group: {_id: null, suma: {$sum: "$count"}}})
{ "result" : [ { "_id" : null, "suma" : 4205965 } ], "ok" : 1 }
```
```
całość: 17005207
wynik: 4205965
%: 24,7%
```

###top100:
```
db.text.aggregate(	{$group: {_id: "$slowa", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 100}, 
					{ $group: {_id: null, suma: {$sum: "$count"}}})
{ "result" : [ { "_id" : null, "suma" : 7998978 } ], "ok" : 1 }
```
```
całość: 17005207
wynik: 7998978
%: 47%
```

###top1000:
```
db.text.aggregate(	{$group: {_id: "$slowa", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 1000}, 
					{ $group: {_id: null, suma: {$sum: "$count"}}})
{ "result" : [ { "_id" : null, "suma" : 11433354 } ], "ok" : 1 }
```
```
całość: 17005207
wynik: 11433354
%: 67,2%
```

#Zadanie 1e
Import danych do bazy:
```
mongoimport -c Miasta < polska.json
```
żeby całość działała, musimy dodać geo-indeks
```
db.Miasta.ensureIndex({"loc" : "2dsphere"})
```

##Przykłady
###1 (dla point, $near)
```
db.Miasta.find({loc: {$near: {$geometry: {type: "Point", coordinates: [21.000366210937496, 52.231163984032676]}, $maxDistance: 90000}}}).skip(1)
```

`21.000366210937496, 52.231163984032676` - To współrzędne Warszawy. Ta komenda pokazuje wszystkie najbliższe miasta w odległości maks 90km od Warszawy. `.skip(1)` powoduje, że pierwsza wartość na liście nie zostanie wyświetlona (tą wartością jest oczywiście sama warszawa)

###2 (Polygon, $geoWithin)
```
db.Miasta.find({loc: {$geoWithin: {$geometry: {type: "Polygon", coordinates: [[[19.259033203125, 52.3923633970718], [18.1768798828125, 51.17589926990911], 
[19.7259521484375, 50.86144411058924], [20.5059814453125, 51.50532341149335], [20.23681640625, 52.1166256737882], [19.259033203125, 52.3923633970718]]]}}}})
```
Współrzędne w tym Polygonie to mniej więcej kształt województwa łodzkiego

###3 (LineString, $geoIntersects)
```
db.Miasta.find({loc: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [[19.010467529296875, -90],[19.010467529296875, 90]]}}}})
```
`$geoIntersects` sprawdza interakcje miedzy dwoma obiektami. Tutaj szuka tego, co leży na południku `19.010467529296875` (niestety, maxDistance tu nie działa, a miara musi być dokładna, żeby cokolwiek znalazł, na tym południku leżą Katowice)

###4 (dla point, $near)
```
db.Miasta.find({loc: {$near: {$geometry: {type: "Point", coordinates: [19.28, 52.04]}}}}).limit(3)
```
Podane współrzędne to geometryczny środek polski. Wyszukujemy 3 najbliższe mu miasta.

###5 (Polygon + $geoIntersects)
```
db.Miasta.find({loc: {$geoIntersects: {$geometry: {type: "Polygon", coordinates: [[[19.259033203125, 52.3923633970718], [18.1768798828125, 51.17589926990911], 
[19.7259521484375, 50.86144411058924], [20.5059814453125, 51.50532341149335], [20.23681640625, 52.1166256737882], [19.259033203125, 52.3923633970718]]]}}}})
```
Wychodzi na to samo co w wersji z `$geoWithin`, czyli do wyszukania tych samych informacji można wykorzystać różne metody - tutaj szukamy teoretycznie nie tego, co jest w polygonie, a co zachodzi z nim w interakcje - czyli wychodzi na to samo w ostatecznym rozrachunku

###6 
```
db.Miasta.find({loc: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [ [18.56586456298828, 54.4448910398684], [19.948768615722656, 49.29803885147804]]}}}})
```
sprawdzamy, czy coś leży między Sopotem a Zakopanym (w linii prostej)
