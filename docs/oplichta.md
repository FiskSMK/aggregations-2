#Oskar Plichta
##Zadanie 1
##a) 

##Poprawianie pliku 
 Plik `Train.csv` posiada znaki nowej lini w polach. Naprawiamy to poleceniem

 ```sh
cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train_prepared.csv
```

##Import pliku 
```sh
time mongoimport -d train -c noSQLExercise --type csv --file Train_prepared.csv --headerline
```
###Czas importu
Posiadam dwie partycje na dysku - jedna dla systemu Windows, system plików NTFS, druga dla systemu Linux, system plików EXT4. Zmierzyłem czasy importu dla obu partycji.

#### Na partycji NTFS
```sh
09:15:23.473 poczatek
09:29:31.362 imported 6034195 objects
13:52 czas 
```

#### Na partycji EXT4
```sh
10:52:36.010  poczatek
10:57:56.850 imported 6034195 objects
5:20 czas
```

##Zliczanie recordów 
```js
mongo
MongoDB shell version: 2.4.6
connecting to: test
> use train
switched to db train
> db.noSQLExcercise.count()
6034195
```
#Zadanie 1c

##Zamiana ciągu tagów na tablicę tagów

Do tego użyłem skryptu `JavaScript` uruchamianego w [`Node.JS`], wersja `0.10.21`

####Wynik

```sh
Połączono z MongoDB 
...
obiektów: 6030000 aktualizacji: 6030000 tagów: 17397682 różnych tagów: 42047
Wykonano 6030000 aktualizacji.
Wykonano 6034195 aktualizacji.
zakończone.
Rozłączono z mongoDB
obiektów: 6034195
updateów: 6034195
tagów: 17409994
różnych tagów: 42048
```
####Sprawdzenie

Element po wykonaniu aktualizacji:

```js
> db.noSQLExercise.findOne()
```
```json
{
	"_id" : ObjectId("5264d48ba86deeabfb702400"),
	"Id" : 1,
	"Title" : "How to check if an uploaded file is an image without mime type?",
	"Body" : "<p>I'd like to check if an uploaded file is an image file (e.g png, jpg, jpeg, gif, bmp) or another file. The problem is that I'm using Uploadify to upload the files, which changes the mime type and gives a 'text/octal' or something as the mime type, no matter which file type you upload.</p><p>Is there a way to check if the uploaded file is an image apart from checking the file extension using PHP?</p>",
	"Tags" : [
    "php",
    "image-processing",
    "file-upload",
    "upload",
    "mime-types"
  ]
}
```
#Zadanie 1d
##Import
Po przygotowaniu pliku text8 zgodnie ze wskazówką zaimportowałem plik text8.txt komendą:

```sh
time mongoimport -d text -c text --type csv --fields 'slowa' --file text8.txt
```
###Czas importu
```sh
real	7m29.447s
user	0m44.847s
sys	0m8.909s
```
Średnio ok. 37 tys./sek 



### Najczęściej występujące słowo

```json
{ "wynik" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
```

```js
`the` występuje 1061396 razy co stanowi 6% wszystkich słów
```
###Czas

```
real	0m9.030s
user	0m0.040s
sys	    0m0.008s
```

### 10 najczęściej występujących słów

```sh
MongoDB shell version: 2.4.6
connecting to: text
{
	"wynik" : [
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
 słów: 10
ilość: 4205965
część: 24.733394894869555%
```

###Czas
```sh
real	0m13.299s
user	0m0.040s
sys	0m0.012s
``````

### 100 najczęściej występujących słów

```json
	"wynik" : [
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
te słowa występują w sumie 7998978 razy co stanowi 47% wszystkich słów
```
###Czas

```
real	0m8.951s
user	0m0.036s
sys	    0m0.016s
```

### 1000 najczęściej wystepujących słów

```json
	"wynik" : [
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
te słowa występują w sumie 11433354 razy co stanowi 67% wszystkich słów
```
###Czas

```sh
real	0m8.899s
user	0m0.084s
sys	    0m0.012s
```

### Wszystkie słowa
W sumie w bazie znajduje się 253854 słów

### Czas

```sh
real	0m10.123s
user	0m0.688s
sys	    0m0.080s
```
#Zadanie 1e
##Dane

Do rozwiązania zadania użyłem danych ze strony [`U.S. Geological Survey`](http://www.usgs.gov/) z działu [`United States Board on Geographic Names`](http://geonames.usgs.gov/) pt. [`Domestic and Antarctic Names`](http://geonames.usgs.gov/domestic/download_data.htm) dla stanu `Massachusetts`.

Źródło danych: [link](http://geonames.usgs.gov/docs/stategaz/MA_Features_20131020.zip)

###Dane

Przed wgraniem pliku do bazy należy najpierw go naprawić zamieniając wszystkie "|" na ",".

`cat AL_Features_20131020.txt | tr "|" "," > AL_Prepared.txt`

Importujemy do bazy poleceniem `time mongoimport -d geoal -c geoal --type csv --headerline --file AL_Prepared.txt`

## Wyniki 

```sh
connected to: 127.0.0.1
Sat Nov  2 20:40:04.886 check 9 62348
Sat Nov  2 20:40:04.957 imported 62347 objects
```

Wgrywanie bazy trwało ponad 1 sekunde

```sh
real	0m1.184s
user	0m0.592s
sys	0m0.080s
```
#Zapytania

## $Near
```js
var punkt = { "type" : "Point", "coordinates" : [ -73.66054066,  42.705867 ] };
```
```js
db.geoma.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 200000} }).toArray()
```
```js
db.geoma.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 20000} }).toArray()
[
	{
		"_id" : ObjectId("52776fa792cbf51bd523b9cf"),
		"id" : 607619,
		"name" : "The Notch",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-73.4717792,
				42.666746
			]
		}
	}
]
```
```js
db.geoma.find({ loc: {$geoWithin : { $center : [ [ -73.4717792,42.666746 ] , 0.15] } }}).toArray();
```
#wynik
```js
[
	{
		"_id" : ObjectId("52776fa792cbf51bd523b9cf"),
		"id" : 607619,
		"name" : "The Notch",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-73.4717792,
				42.666746
			]
		}
	},
	{
		"_id" : ObjectId("52776fa892cbf51bd523e8b9"),
		"id" : 954822,
		"name" : "Kronk Brook",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-73.3556647,
				42.6325806
			]
		}
	}
]

#przykład 3

var obszar = {     "type" : "Polygon",      "coordinates" :      [ [          [ -74 , 42.75 ],          [ -73 , 42.75 ],          [ -73 , 42    ],          [ -74 , 42    ],          [ -74 , 42.75 ]      ] ] };

##wynik

1815 elementow

```js
	{
		"_id" : ObjectId("52776fa792cbf51bd523b895"),
		"id" : 607304,
		"name" : "Becker Pond",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-73.459358,
				42.0587831
			]
		}
	}
```


#przyklad 4
var linia = {   "type": "LineString",    "coordinates":      [       [ -73 , 42 ] , [ -74 , 42.75 ]     ] };


```js
db.geoma.find({ loc : { $geoIntersects : { $geometry : linia } } }).toArray();
```
Pełen wynik [tutaj](/scripts/oplichta/1e/5e.geojson).
/scripts/oplichta/1e/5e.geojson