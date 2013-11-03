Technologie_nosql
=================

###Zad 1.

##a) i b) 
Przed zaimportowaniem należy poprawić plik Train.csv.

```sh
cat Train.csv | tr "\n" " " | tr "\r" "\n" > Train_prepared.csv
```

usuniecie pustej lini:

```sh
head -n 6034196 Train2.csv > Train.csv
```

Sprawdzamy ilość linii:

```sh
wc -l Train.csv
6043196 Train.csv
```

Po poprawieniu pliku mozemy go zaimportowac do bazy mierzac czas przebiegu tej operacji.

```sh
mongoimport -d train -c train --type csv --headerline --file Train.csv
```

-------------------------------------------------------------------------

##c)

Do rozwiazania uzylem skryptu `JavaScript`.

```sh
time node scriptc.js
```
Wykonano `6034195` aktualizacji.

###Czasy

```
real	11m35.343s
user	4m09.122s
sys	0m5.784s
```

-------------------------------------------------------------------------

##d)

Sciagamy plik:

```sh
wget http://mattmahoney.net/dc/text8.zip -O text8.gz
```

Wskazowki:

```sh
tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt
ls -l deleted.txt
  -rw-rw-r--. 1 wbzyl wbzyl 0 10-16 12:58 deleted.txt # rozmiar 0 -> OK
rm deleted.txt
```

```sh
wc text8
  0         17005207 100000000 text8
tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
wc text8.txt
  17005207  17005207 100000000 text8.txt  # powtórzone 17005207 -> OK
```
Uzylem skryptu `JavaScript`.

Importuje plik:
```sh
mongoimport -d text -c text --type csv --fields 'word' --file text8.txt 
```

...

Do zliczania słów zostaa użyta agregacja.

###Różne słowa:

```sh
słów: 253854
część: 100%
```

###10 słów

```json

    { "_id" : "the",  "count" : 1061396 },
    { "_id" : "of",   "count" : 593677  },
    { "_id" : "and",  "count" : 416629  },
    { "_id" : "one",  "count" : 411764  },
    { "_id" : "in",   "count" : 372201  },
    { "_id" : "a",    "count" : 325873  },
    { "_id" : "to",   "count" : 316376  },
    { "_id" : "zero", "count" : 264975  },
    { "_id" : "nine", "count" : 250430  },
    { "_id" : "two",  "count" : 192644  }

```

```sh
słów: 10
część: 24.7%
```

###100 słów


```json
    //...
    { "_id" : "history", "count" : 12623   },
    { "_id" : "will",    "count" : 12560   },
    { "_id" : "up",      "count" : 12445   },
    { "_id" : "while",   "count" : 12363   },
    { "_id" : "where",   "count" : 12347   }

```

```sh
słów: 100
część: 47.0%
```

###1000 słów

```json
    //...
    { "_id" : "child",   "count" : 1789    },
    { "_id" : "element", "count" : 1787    },
    { "_id" : "appears", "count" : 1786    },
    { "_id" : "takes",   "count" : 1783    },
    { "_id" : "fall",    "count" : 1783    }

```

```sh
słów: 1000
część: 67.2%
```

-----------------------------------------------------------------------------

##e)

Wyszukać w sieci dane zawierające obiekty [`GeoJSON`](http://geojson.org/geojson-spec.html#examples). Zapisać dane w bazie `MongoDB`.

Znalazłem baze danych stanow w USA i wybrałem Hawaje.

```sh
mongoimport -d geohi -c hi --type csv --headerline --file HI.txt
```
Przykład:
```json
{
	"_id" : ObjectId("5275513af034e1629d65a630"),
	"id" : 247074,
	"name" : "Pacific Ocean",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			-123.8447222,
			39.3102778
		]
	}
}
```

####Dodaje indeks:
```js
db.geohi.ensureIndex({"loc" : "2dsphere"});
```

###Geospatial Queries:

```sh
db.geohi.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 200} }).toArray();
```
Wynik:

0 Obiektów

```sh
db.geohi.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 2000000} }).toArray();
```

Wynik:
```json
[
	{
		"_id" : ObjectId("5275513af034e1629d65a630"),
		"id" : 247074,
		"name" : "Pacific Ocean",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-123.8447222,
				39.3102778
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cff1"),
		"id" : 2733431,
		"name" : "World War II Valor in the Pacific National Monument",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-121.3746611,
				41.8866098
			]
		}
	}
]
```

```sh
db.geohi.find({   loc: {$geoWithin : { $center : [ [ -123.8447222, 39.3102778 ] , 40 ] } }  }).toArray();
```


Wynik:
```json
/...
	{
		"_id" : ObjectId("5275513cf034e1629d65cfe5"),
		"id" : 2679017,
		"name" : "Brandt Field Airport",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-156.7370309,
				21.138565
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cfe6"),
		"id" : 2680978,
		"name" : "Wahiawā Naval Reservation (historical)",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-158.02631,
				21.51584
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cfe7"),
		"id" : 2704523,
		"name" : "Nohili Dune",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-159.7824955,
				22.0629315
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cfe8"),
		"id" : 2707655,
		"name" : "Oahu Forest National Wildlife Refuge",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.9227684,
				21.4842871
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cfe9"),
		"id" : 2707759,
		"name" : "Kahuā Ranch",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.1051092,
				19.8427133
			]
		}
	},
	{
		"_id" : ObjectId("5275513cf034e1629d65cfea"),
		"id" : 2707779,
		"name" : "Hakalau Forest National Wildlife Refuge",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.2794743,
				19.8304613
			]
		}
	}
	/...
```
