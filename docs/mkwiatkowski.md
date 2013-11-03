### Treść
`Zadanie 1a` polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku `Train.csv` bazy:

   * `MongoDB`
   * `PostgreSQL` – opcjonalnie dla znających fanów SQL

### Poprawienie pliku

Aby poprawnie zaimportowac plik nalezy najpierw usunąć z niego znaki nowej lini `\n` co mozna zrobić w nastepujący sposób:

`cat Train.csv | tr "\n" " " | tr "\r" "\n" > Train_prepared.csv`

Po tej operacji plik posiada 6034197 lini, a więc o jedną za dużo. Na końcu pliku znajduje się pusta linia która nalezy usunąć. Teraz mozna zrobić import.

### Import

Czas importu mierzymy poleceniem time
`time mongoimport -d train -c train --type csv --headerline --file Train.csv` 

```
connected to: 127.0.0.1
Wed Oct 30 12:48:02.078 		Progress: 57919742/7253917399	0%
Wed Oct 30 12:48:02.078 			48200	12050/second
...
...
...
Wed Oct 30 12:54:27.145 		Progress: 7188208479/7253917399	99%
Wed Oct 30 12:54:27.145 			5979500	15371/second
Wed Oct 30 12:54:29.540 check 9 6034196
Wed Oct 30 12:54:29.571 imported 6034195 objects
```

### Wyniki

```
real	6m32.087s
user	1m13.177s
sys	0m6.196s
```

### Treść
Zadanie 1b. Zliczyć liczbę zaimportowanych rekordów

###Sprawdzenie
```js
MongoDB shell version: 2.4.7
connecting to: test
> use train
switched to db train
> db.train.count()
6034195
```
### Treść
`Zadanie 1c` (Zamiana formatu danych.) Zamienić string zawierający tagi na tablicę napisów z tagami następnie zliczyć wszystkie tagi i wszystkie różne tagi. Napisać program, który to zrobi korzystając z jednego ze sterowników. Lista sterowników jest na stronie MongoDB Ecosystem.

### Wyniki

Wykonano `6034195` aktualizacji.
```
Update-y zakończone.
...
`ilość obiektów:` 6034195
`ilość updateów:` 6034195
`ilość tagów:` 17409994
`różnych tagów:` 42048
```

Czas opreacji wyniósł

```
real	9m49.453s
user	3m13.112s
sys	    0m4.784s
```
### Treść
`Zadanie 1d`. Ściągnąć plik `text8.zip` ze strony `Matt Mahoney` (po rozpakowaniu 100MB):

`wget http://mattmahoney.net/dc/text8.zip -O text8.gz`

Zapisać wszystkie słowa w bazie `MongoDB`. Następnie zliczyć liczbę słów oraz liczbę różnych słów w tym pliku. Ile procent całego pliku stanowi:

   * `najczęściej występujące słowo w tym pliku`
   * `10, 100, 1000 najczęściej występujących słów w tym pliku`

Wskazówka: Zaczynamy od prostego EDA. Sprawdzamy, czy plik text8 zawiera wyłącznie znaki alfanumeryczne i białe:

```
tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt
ls -l deleted.txt
  -rw-rw-r--. 1 wbzyl wbzyl 0 10-16 12:58 deleted.txt # rozmiar 0 -> OK
rm deleted.txt
```

Dopiero teraz wykonujemy te polecenia:

```
wc text8
  0         17005207 100000000 text8
tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
wc text8.txt
  17005207  17005207 100000000 text8.txt  # powtórzone 17005207 -> OK
```

###Wyniki

Import bazy poleceniem `time mongoimport -d text -c text -type csv --fields 'word' --file text8.txt`

```
connected to: 127.0.0.1
Sat Nov  2 20:04:02.037 		Progress: 682283/100000000	0%
Sat Nov  2 20:04:02.037 			113100	37700/second
...
...
...
Sat Nov  2 20:10:15.007 		Progress: 99205240/100000000	99%
Sat Nov  2 20:10:15.007 			16870900	44869/second
Sat Nov  2 20:10:17.699 check 9 17005207
Sat Nov  2 20:10:17.823 imported 17005207 objects
```
Cała operacja trwała 6 minut i 18 sekund

```
real	6m18.181s
user	0m35.438s
sys	0m5.932s
```

## Słowa

### Najczęściej występujące słowo

```json
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
```

```js
`the` występuje 1061396 razy co stanowi 6.241594118789616% wszystkich słów
```
###Czas

```
real	0m9.030s
user	0m0.040s
sys	    0m0.008s
```

### 10 najczęściej występujących słów

```json
	"result" : [
		{
			"_id" : "the",
			"count" : 1061396
		},
		{
			"_id" : "of",
			"count" : 593677
		},
		{
			"_id" : "and",
			"count" : 416629
		},
		{
			"_id" : "one",
			"count" : 411764
		},
		{
			"_id" : "in",
			"count" : 372201
		},
		{
			"_id" : "a",
			"count" : 325873
		},
		{
			"_id" : "to",
			"count" : 316376
		},
		{
			"_id" : "zero",
			"count" : 264975
		},
		{
			"_id" : "nine",
			"count" : 250430
		},
		{
			"_id" : "two",
			"count" : 192644
		}
	],
	"ok" : 1
}
```

```js
te słowa występują w sumie 4205965 razy co stanowi 24.733394894869555% wszystkich słów
```
###Czas

```
real	0m8.906s
user	0m0.032s
sys	    0m0.016s
```

### 100 najczęściej występujących słów

```json
	"result" : [
		{
			"_id" : "the",
			"count" : 1061396
		},
		{
			"_id" : "of",
			"count" : 593677
		},
		{
			"_id" : "and",
			"count" : 416629
		},
		{
			"_id" : "one",
			"count" : 411764
		},
		{
			"_id" : "in",
			"count" : 372201
		},
		...
		...
		...
		{
			"_id" : "history",
			"count" : 12623
		},
		{
			"_id" : "will",
			"count" : 12560
		},
		{
			"_id" : "up",
			"count" : 12445
		},
		{
			"_id" : "while",
			"count" : 12363
		},
		{
			"_id" : "where",
			"count" : 12347
		}
	],
	"ok" : 1
}

```

```js
te słowa występują w sumie 7998978 razy co stanowi 47.03840417820259% wszystkich słów
```
###Czas

```
real	0m8.951s
user	0m0.036s
sys	    0m0.016s
```

### 1000 najczęściej wystepujących słów

```json
	"result" : [
		{
			"_id" : "the",
			"count" : 1061396
		},
		{
			"_id" : "of",
			"count" : 593677
		},
		{
			"_id" : "and",
			"count" : 416629
		},
		{
			"_id" : "one",
			"count" : 411764
		},
		{
			"_id" : "in",
			"count" : 372201
		},
		...
		...
		...
		{
			"_id" : "child",
			"count" : 1789
		},
		{
			"_id" : "element",
			"count" : 1787
		},
		{
			"_id" : "appears",
			"count" : 1786
		},
		{
			"_id" : "takes",
			"count" : 1783
		},
		{
			"_id" : "fall",
			"count" : 1783
		}
	],
	"ok" : 1
}

```

```js
te słowa występują w sumie 11433354 razy co stanowi 67.23443001899359% wszystkich słów
```
###Czas

```
real	0m8.899s
user	0m0.084s
sys	    0m0.012s
```

### Wszystkie słowa
W sumie w bazie znajduje się 253854 słów

### Czas

```
real	0m10.123s
user	0m0.688s
sys	    0m0.080s
```

## Treść


`zadanie 1e`. Wyszukać w sieci dane zawierające obiekty [`GeoJSON`](http://geojson.org/geojson-spec.html#examples). Zapisać dane w bazie `MongoDB`.

Dla zapisanych danych przygotować 6–9 różnych [`Geospatial Queries`](http://docs.mongodb.org/manual/applications/geospatial-indexes/) (co najmniej po jednym dla obiektów `Point`, `LineString` i `Polygon`). W przykładach należy użyć każdego z tych operatorów: `$geoWithin`, `$geoIntersect`, `$near`.

##Dane

Do rozwiązania zadania użyłem danych ze strony [`U.S. Geological Survey`](http://www.usgs.gov/) z działu [`United States Board on Geographic Names`](http://geonames.usgs.gov/) pt. [`Domestic and Antarctic Names`](http://geonames.usgs.gov/domestic/download_data.htm) dla stanu `Alabama`.

Źródło danych: [link](http://geonames.usgs.gov/docs/stategaz/AL_Features_20131020.zip)

###Dane

Przed wgraniem pliku do bazy należy najpierw go naprawić zamieniając wszystkie "|" na ",".

`cat AL_Features_20131020.txt | tr "|" "," > AL_Prepared.txt`

Importujemy do bazy poleceniem `time mongoimport -d geoal -c geoal --type csv --headerline --file AL_Prepared.txt`

## Wyniki 

```
connected to: 127.0.0.1
Sat Nov  2 20:40:04.886 check 9 62348
Sat Nov  2 20:40:04.957 imported 62347 objects
```

Wgrywanie bazy trwało niespełna 2 sekundy

```
real	0m1.907s
user	0m0.752s
sys	0m0.040s
```

#Zapytania

## $Near

```js
var punkt = { "type" : "Point", 
			"coordinates" : [ -73.6605406,  40.9844661 ] };
```

```js
db.geoal.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 300} }).toArray()
```

```json
[
	{
		"_id" : ObjectId("52758765c95267aa51542c47"),
		"id" : 123910,
		"name" : "New Town",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-85.8174748,
				34.8734153
			]
		}
	},
	{
		"_id" : ObjectId("52758765c95267aa5154675f"),
		"id" : 139265,
		"name" : "Rosenwald School (historical)",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-85.8160859,
				34.8756376
			]
		}
	}
]
```
## $geoWithin

###center

```js
db.geoal.find({ loc: { $geoWithin: {$center : [[ -88.1356465, 33.6492873 ], 0.2 ]} } }).toArray()
```

### Wynik

`305`

### Polygon

```js
var pole = { "type" : "Polygon", "coordinates" : [ [ [-88, 33.80], [-87, 33.80], [-87, 33 ], [-88, 33], [-88, 33.80] ]] };
```

```js
db.geoal.find({ loc: { $geoWithin: {$geometry : pole} } }).toArray()
```
###Wynik

`4359`

### LineString

```js
db.geoal.find({ loc: { type : "LineString", coordinates : [ [-87, 33], [-88, 31] ] } } ).toArray()
```

###Wynik

`0`


### Intersects

```js
var pole = { "type" : "Polygon", "coordinates" : [ [ [-88, 33.80], [-87, 33.80], [-87, 33 ], [-88, 33], [-88, 33.80] ]] };
```

```js
db.geoal.find({ loc: { $geoIntersects: {$geometry : pole} } }).toArray()
```
###Wynik

`4359`