### *Mateusz Pikora*

----

## Uwagi wstępne
Wszystkie operacje przeprowadziłem używając laptopa Packard Bell EasyNote LM86.

## Zadanie 1
### a)
Najpierw przygotowałem plik do importu za pomocą skryptu 2unix.sh. Import do bazy wykonałem poleceniem:

```
~/mongodb-linux/bin/mongoimport --type csv -c Train --file ./Train.csv --headerline
```

Czas importowania pliku wyniósł 9 minut i 10 sekund.

### b)
Ilość wczytanych rekordów sprawdziłem poleceniem:

```
db.Train.count()
```

Otrzymałem wynik 6034195, zgodny z liczbą rekordów w pliku.

### c)
Program konwertujący tagi na tablicę napisów napisałem w języku C. Jego kod znajduje się [tutaj](/docs/mpikora/mongo1c.c).
Należy go skompilowac poleceniem (po zainstalowaniu odpowiednich sterowników):

```
gcc -Wall --std=c99 -Wall -pedantic mongo1c.c -lmongoc
```

Czas jego działania wyniósł 1 godzinę, 8 minut i 51 sekund.

### d)

Plik przygotowałem do importu zgodnie z opisem w poleceniu. Import wykonałem przez:

```
/usr/bin/time -o plik1d.txt ~/mongodb-linux/bin/mongoimport --type csv -f word -c text8 --file ./text8.txt
```

Trwał on 7 minut i 57 sekund. Następnie przeprowadziłem następującą analizę danych:

``` 
db.text8.count()
```

Wszystkich słów w pliku jest 17005207.

```
db.text8.distinct("word").length
```

Różnych słów jest 253854.

```
db.text8.aggregate([ {$group:{ _id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1} ])

{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
```

1061396/17005207=0.0624
Najczęściej występujące słowo w tym pliku stanowi około 6,25% jego zawartości.

```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])

{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }
```

4205965/17005207=0.2473
10 najczęściej występujących słów stanowi około 24,73% jego zawartości.

```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])

{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }
```

7998978/17005207=0.4704
100 najczęściej występujących słów stanowi około 47% jego zawartości.

```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])

{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }
```

11433354/17005207=0.6723
1000 najczęściej występujących słów stanowi około 67% jego zawartości.

### e)
Do zadania użyłem danych dotyczących hrabstw w USA.Dostępne są one pod adresem (http://eric.clst.org/Stuff/USGeoJSON). Kilku Jsonów mongo nie był w stanie poprawnie sparsować, więc usunąłem je. Dane wczytałem do bazy poleceniem:

```
~/mongodb-linux/bin/mongoimport -c uscounties --file ./geojsonuscounties.txt
```

-77.03,38.88 (Przybliżone koordynaty miasta Waszyngton)
-87.62,41.87 (Przybliżone koordynaty miasta Chicago)
Przykładowe zapytania:

hrabstwo, w którym znajduje się Waszyngton:

```
db.uscounties.findOne({ geometry: {$near: {$geometry: {type: "Point", coordinates: [-38.88,77.03]}}} })
```

10 hrabstw najbliższych Waszyngtonowi, pomijając hrabstwo w którym leży:

```
db.uscounties.find({ geometry: {$near: {$geometry: {type: "Point", coordinates: [-77.03,38.88]}}} }).skip(1).limit(10)
```

Wyświetl wszystkie hrabstwa leżące wewnątrz kwadratu [-100,35], [-102,35], [-102,37], [-100,37]:
```
db.uscounties.find({geometry: {$geoWithin: {$geometry: {type: "Polygon", coordinates: [[[-100,35], [-102,35], [-102,37], [-100,37], [-100,35]]]} } } } )
```

Wyświetl wszystkie hrabstwa leżące na równoleżniku 40:
```
db.uscounties.find( {geometry: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [ [-0,40], [-90,40], [-180,40] ]}}}})
```

Wyświetl wszystkie hrabstwa leżące do 100km od Waszyngtonu
```
db.uscounties.find({ geometry: {$near: {$geometry: {type: "Point", coordinates: [-77.03,38.88]}}, $maxDistance : 100000 } })
```

Wyświetl hrabstwa leżące na drodze z Chicago do Waszyngtonu (w linii prostej)

```
db.uscounties.find( {geometry: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [ [-77.03,38.88], [-87.62,41.87] ]}}}})
```
