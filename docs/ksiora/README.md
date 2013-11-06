**Specyfikacja techniczna**
```
Intel i5-430M 2,26 GHz 4 rdzenie
4 GB RAM
MongoDB shell version: 2.4.8
```
Do mierzenia czasu użyłem pliku wsadowego [timer.cmd](https://github.com/Siorski/aggregations-2/blob/master/scripts/ksiora/timer.cmd).

## 1a
Do przygotowania pliku train.csv użyłem skrtyptu [2unix.bash](https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh).

![img](http://i39.tinypic.com/2qa4ok7.png)

Czas trwania 31m 46s.

Importowanie danych:

```
mongoimport --type csv -c Train --file Train2.csv --headerline
```

![img](http://i39.tinypic.com/2hcdgzp.png)
![img](http://i43.tinypic.com/2l6q95.png)

Czas trwania 57m 46s.

## 1b
```
db.train2.count();
```
Rezultat:
```
6034195
```

## 1c
Użyłem skryptu [convert.js](https://github.com/Siorski/aggregations-2/blob/master/scripts/ksiora/convert.js).

![img](http://i42.tinypic.com/mc9dox.png)

Czas trwania 35m 45s.

## 1d
Importowanie:

```
mongoimport -c text --fields word --type csv --file text8.txt
```
![img](http://i39.tinypic.com/21ayfxw.png)
![img](http://i41.tinypic.com/2j4zdw0.png)

Czas trwania 28m 14s.

Całkowita liczba słów oraz liczba różnych słów:

![img](http://i44.tinypic.com/3162gdv.png)

Najczęściej występujące słowa:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 1 }, //10, 100, 1000
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```

```
Najczęściej występujące słowo pojawia się 1061396 razy, co stanowi 6.24 %.
10 najczęściej występujących słów pojawia się łącznie 4205965 razy, co stanowi 24.73 %.
100 najczęściej występujących słów pojawia się łącznie 7998978 razy, co stanowi 47.04 %.
1000 najczęściej występujących słów pojawia się łącznie 11433354 razy, co stanowi 67,23 %.
```

## 1e

**Dane**

Do rozwiązania zadania użyłem danych ze strony [U.S. Board on Geographic Names](http://geonames.usgs.gov/domestic/download_data.htm). Dane dotyczą stanu Hawaje.

Przed importem danych do bazy należy zamienić wszystkie znaki `|` na `,`. Zrobiłem to funkcją `replace` w programie `Sumblime Text 2`.

Import do bazy:
```
mongoimport -c geo --type csv --headerline --file HI_Features.txt
```
![img](http://i41.tinypic.com/dggrig.png)

Czas trwania poniżej 2s.

**Dokument przed obróbką**

```json
{
	"_id" : ObjectId("52792a2d2a71351c64e443aa"),
	"FEATURE_ID" : 247074,
	"FEATURE_NAME" : "Pacific Ocean",
	"FEATURE_CLASS" : "Sea",
	"STATE_ALPHA" : "CA",
	"STATE_NUMERIC" : 6,
	"COUNTY_NAME" : "Mendocino",
	"COUNTY_NUMERIC" : 45,
	"PRIMARY_LAT_DMS" : "391837N",
	"PRIM_LONG_DMS" : "1235041W",
	"PRIM_LAT_DEC" : 39.3102778,
	"PRIM_LONG_DEC" : -123.8447222,
	"SOURCE_LAT_DMS" : "",
	"SOURCE_LONG_DMS" : "",
	"SOURCE_LAT_DEC" : "",
	"SOURCE_LONG_DEC" : "",
	"ELEV_IN_M" : 0,
	"ELEV_IN_FT" : 0,
	"MAP_NAME" : "Mendocino",
	"DATE_CREATED" : "01/19/1981",
	"DATE_EDITED" : "05/16/2011"
}
```

Aby oczyścić dane ze zbędnych rzeczy oraz utworzyć punkty ze współrzędnych geograficznych użyłem [zmiana.js](https://github.com/Siorski/aggregations2/blob/master/scripts/ksiora/zmiana.js). 

![img](http://i44.tinypic.com/208z7g3.png)

**Dokument po obróbce**

```json
{
	"_id" : ObjectId("527980d2378818c80f82761c"),
	"id" : 247074,
	"nazwa" : "Pacific Ocean",
	"typ" : "Sea",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			-123.8447222,
			39.3102778
		]
	}
}
```

Dodajemy geo-indeks:

```
db.geo2.ensureIndex({'loc' : '2dsphere'})
```

**Zapytania**

Zapytanie 1. Ile obiektów znajduje się w odległości 200m od Royal Mausoleum.

```js
var punkt = { "type" : "Point", "coordinates" : [ -157.847598, 21.325398] }; //Royal Mausoleum
db.geo2.find(
  {loc:
    {$near: {$geometry: punkt}, 
     $maxDistance: 200} 
  }).toArray();
```

Wynik:

```json
[
	{
		"_id" : ObjectId("5279843b97d9a4724cad52a6"),
		"id" : 364220,
		"nazwa" : "Royal Mausoleum",
		"typ" : "Cemetery",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.847306,
				21.32526
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad3ca3"),
		"id" : 358537,
		"nazwa" : "Alapena Pool",
		"typ" : "Lake",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.8458977,
				21.3252381
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad621e"),
		"id" : 1946891,
		"nazwa" : "International Christian Church",
		"typ" : "Church",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.8463889,
				21.3241667
			]
		}
	}
]
```

Zapytanie 2. Wszystkie punkty w linii prostej od The Bernice Pauahi Bishop Museum do Honolulu Community Collage.

```js
db.geo2.find( 
  {loc: 
    {type: "LineString", coordinates: 
      [ [-157.871132, 21.333513], [-157.869844, 21.317362] ] 
    } 
  });
```

Wynik: `0`.


Zapytanie 3. Wszystkie plaże w odległości 2500 km od Shangri La.

```js
var punkt = { "type" : "Point", "coordinates" : [-157.794828, 21.256902] };
db.geo2.find(
	{loc:
	  {$near: 
	  	{$geometry: punkt},
          $maxDistance : 2500}, 
	      typ: "Beach"}
).toArray();
```

Wynik:

```json
[
	{
		"_id" : ObjectId("5279843b97d9a4724cad5b52"),
		"id" : 1904692,
		"nazwa" : "Kaalawai Beach",
		"typ" : "Beach",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.799356,
				21.2566466
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad5b92"),
		"id" : 1904757,
		"nazwa" : "Kuilei Beach",
		"typ" : "Beach",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.8044683,
				21.2557467
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad4109"),
		"id" : 359674,
		"nazwa" : "Kāhala Beach",
		"typ" : "Beach",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.7811009,
				21.2644405
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad5b0e"),
		"id" : 1904624,
		"nazwa" : "Kaluahole Beach",
		"typ" : "Beach",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-157.817617,
				21.257613
			]
		}
	}
]
```

Zapytanie 4. Liczba szpitali w odległości 5km od centrum Pearl City

```js
var punkt = { "type" : "Point", "coordinates" : [-157.973528, 21.397359] };
db.geo2.find(
  {loc: 
    {$near: 
      {$geometry:  punkt},
          $maxDistance : 5000}, 
	      typ: "Hospital"}
).count();
```

Wynik: `3`.

Zapytanie 5. Szkoły w określonym obszarze 

```js
db.geo2.find( 
  { loc :
    { $geoIntersects :
      { $geometry :
        { type : "Polygon",
        coordinates : [[
        [-155.098715, 19.723484],
		[-155.090733, 19.703607],
		[-155.073738, 19.710718],
		[-155.086784, 19.727039],
		[-155.098715, 19.723484]]]
	} 
   } 
  },
  typ : "School"
 }).toArray();
 ```

Wynik:

 ```json
 [
	{
		"_id" : ObjectId("5279843b97d9a4724cad52b7"),
		"id" : 364237,
		"nazwa" : "Saint Josephs High School",
		"typ" : "School",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.0877778,
				19.7172222
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad5e72"),
		"id" : 1905518,
		"nazwa" : "Maunaloa Elementary School",
		"typ" : "School",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.0919444,
				19.7225
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad5eb7"),
		"id" : 1905593,
		"nazwa" : "Urawantadai Hawaii College",
		"typ" : "School",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.0919444,
				19.7236111
			]
		}
	},
	{
		"_id" : ObjectId("5279843b97d9a4724cad4466"),
		"id" : 360544,
		"nazwa" : "Kapiolani Elementary School",
		"typ" : "School",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-155.0816667,
				19.7166667
			]
		}
	}
]
```

Zapytanie 6. Ilość budynków dookoła portu lotniczego Honolulu 

```js
db.geo2.find(
  { loc: 
    { $geoWithin :
      { $center : [ [-157.921515, 21.332474], 0.01 ] }
     } 
  } 
).count();
```

Wynik: `4`.