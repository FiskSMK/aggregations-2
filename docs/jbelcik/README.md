### *Jakub Bełcik*

---

* [Dane techniczne](#dane-techniczne)
* [Zadanie 1a](#zadanie-1a)
* [Zadanie 1b](#zadanie-1b)
* [Zadanie 1c](#zadanie-1c)
* [Zadanie 1d](#zadanie-1d)
* [Zadanie 1e](#zadanie-1e)

---

### Dane Techniczne

Procesor:
	AMD Phenom II x4 955 3.2GHz

RAM:
	Kingston HyperX 2x2GB 1333MHz DDR3

Dysk Twardy:
	Samsung Spin Point F1 320GB SATA II, NCQ, 16MB

System operacyjny:
	Windows 7 Professional x64

Środowisko:
	Cygwin 1.7.25 x64

Baza Danych:
	MongoDB 2.4.7 x64

---

### Zadanie 1a

```
Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych
z pliku Train.csv bazy:

	* MongoDB
	* PostgreSQL – opcjonalnie dla znających fanów SQL
```

Aby plik Train.csv został poprawnie zaimportowany do bazy danych, trzeba usunąć znaki nowej linii. Zrobi to za nas [skrypt](../../scripts/wbzyl/2unix.sh) dostępny w repozytorium prowadzącego.

```sh
$ time ./2unix.sh Train.csv trainProper.csv

real    11m30.359s
user    2m47.605s
sys     1m43.721s

$ time mongoimport -d dataBase -c train --type csv --file trainProper.csv --headerline
connected to: 127.0.0.1
check 9 6034196
imported 6034195 objects

real    15m50.589s
user    0m0.000s
sys     0m0.031s
```

Średnio ~6348 import'ów na sekundę

---

### Zadanie 1b

```
Zliczyć liczbę zaimportowanych rekordów (Odpowiedź: imported 6_034_195 objects).
```

```js
> db.train.count()
6034195
```

---

### Zadanie 1c

```
(Zamiana formatu danych.) Zamienić string zawierający tagi na tablicę napisów z tagami następnie zliczyć
wszystkie tagi i wszystkie różne tagi. Napisać program, który to zrobi korzystając z jednego ze sterowników.
```

Do tego zadania wykorzystałem własny [skrypt](../../scripts/jbelcik/1c.js), który rozbija 'spacjami' pole tags typu String na tablice String'ów.

```sh
$ time mongo 1c.js
6032934 records updated

real    13m3.721s
user    0m0.000s
sys     0m0.015s
```

Średnio ~7698 update'ów na sekundę

---

### Zadanie 1d

```
Ściągnąć plik text8.zip, zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz
liczbę różnych słów w tym pliku. Ile procent całego pliku stanowi:

	* najczęściej występujące słowo w tym pliku
	* 10, 100, 1000 najczęściej występujących słów w tym pliku
```

Sprawdzamy, czy plik text8 zawiera wyłącznie znaki alfanumeryczne i białe oraz znaki puste zastępujemy znakiem nowej linii.

```sh
$ tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt

$ ls -l deleted.txt
-rw-r--r-- 1 froggman None 0 11-04 19:55 deleted.txt

$ rm deleted.txt

$ wc text8
        0  17005207 100000000 text8

$ tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt

$ wc text8.txt
 17005207  17005207 100000000 text8.txt
 
$ time mongoimport -d text8 -c text8 -f word --type csv --file text8.txt
connected to: 127.0.0.1
check 9 17005208
imported 17005207 objects

real    6m8.782s
user    0m0.000s
sys     0m0.015s
```

Ilość wystąpień wszystkich słów:

```js
> db.text8.count()
17005207
```

Ilość wystąpień różnych słów:

```js
> db.text8.distinct("word").length
253854
```

Najpopularniejsze słowo, jego ilość wystąpień oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1}
> ])
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }

> 1061396 / 17005207 * 100
6.241594118789616
```

Ilość wystąpień 10 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 10},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }

> 4205965 / 17005207 * 100
24.733394894869555
```

Ilość wystąpień 100 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 100},
> 	{$group: {_id: null, count: {$sum: "$count"}}},
> ])
{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }

> 7998978 / 17005207 * 100
47.03840417820259
```

Ilość wystąpień 1000 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1000},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }

> 11433354 / 17005207 * 100
67.23443001899359
```

---

### Zadanie 1e

```
Wyszukać w sieci dane zawierające obiekty GeoJSON. Zapisać dane w bazie MongoDB. Dla zapisanych
danych przygotować 6–9 różnych Geospatial Queries (co najmniej po jednym dla obiektów Point,
LineString i Polygon). W przykładach należy użyć każdego z tych operatorów: $geoWithin, $geoIntersect,
$near.
```

Poniższe zadanie zostało wykonane opierając się o [dane współrzędnych geograficznych miejscowości w Polsce (możliwe błędy)](http://astrowiki.eu/index.php?title=Wsp%C3%B3%C5%82rz%C4%99dne_geograficzne_miejscowo%C5%9Bci_w_Polsce), które znalazłem w internecie i wstępnie obrobiłem na plik typu [csv](../../data/jbelcik/miasta.csv).

```sh
$ time mongoimport -d miasta -c miasta --type csv --file miasta.csv --headerline
connected to: 127.0.0.1
check 9 2319
imported 2318 objects

real    0m0.130s
user    0m0.000s
sys     0m0.015s
```

Przykładowy rekord:

```js
> db.miasta.findOne()
{ "_id" : 1, "miasto" : "Adamów", "szerokosc" : 22.15, "dlugosc" : 51.45 }
```

Do tego zadania wykorzystałem własny [skrypt](../../scripts/jbelcik/1e.js), który znajduje każdy rekord nieodpowiadający formatowi, usuwa go i zastępuje poprawnym.

```sh
$ time mongo 1e.js
2318 records changed

real    0m0.210s
user    0m0.000s
sys     0m0.015s
```

Przykładowy poprawiony rekord:

```js
> db.miasta.findOne()
{
        "_id" : 1,
        "miasto" : "Adamów",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        22.15,
                        51.45
                ]
        }
}
```

Dodajemy geo-indeks do kolekcji:

```js
> db.miasta.ensureIndex({"loc" : "2dsphere"})
```


# Point + $geoWithin



# Point + $geoIntersect



# Point + $near



# LineString + $geoWithin



# LineString + $geoIntersect



# LineString + $near



# Polygon + $geoWithin



# Polygon + $geoIntersect



# Polygon + $near


