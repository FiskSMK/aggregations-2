# *Grzegorz Melzer*

----

### Zadanie 1a

----

Dane przygotowałem przy pomocy komendy
```sh
tr -d "\n" < Train.csv | tr "\r" "\n" | head -n 6034196 > TrainO.csv
```
Przy dysku ssd wynik wyniósł:
```sh
real  2m45.567s
user  0m32.282s
sys   0m22.363s

```

Polecenie użyte do zimportowania danych:
```sh
mongoimport -d trains -c trains --type csv --file TrainO.csv --headerline
```

czas importowania:
```sh
real  4m56.391s
user  3m9.219s
sys   0m36.793s
```

### Zadanie 1b

----

ilość obiektów: 
```sh
Wen Oct 30 15:22:20.152 imported 6034195 objects
```

upewnienie się:
```js
> use trains
switched to db trains
> db.train.count()
6034195
```

### Zadanie 1c

----

Użyłem node.js do napisania [skryptu](../scripts/gmelzer/node-mongo.js) a skrócony wynik ma się następująco(niestety nie ma czasu bo zagapiłem się przy pisaniu programu i nie dałem zakończenia ale powinien on wynosić ok 5min):
```sh
Ilość dokumentów: 6034195
Ilość różnych tagów: 42049
Ilość tagów: 17409994
```
Dokładny wynik [tutaj](./gmelzer/res.txt)
### Zadanie 1d

----

Przerobiłem plik przy pomocy podpowiedzi a wynik importu to:
```sh
Thu Oct  31 12:31:52.521 check 9 17005207
Thu Oct  31 12:31:52.879 imported 17005207 objects

real	1m14.121s
user	0m12.265s
sys		0m3.611s
```

#### All
```js
db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$group:{_id:"wszystkie",count:{$sum:1}}})
```
```json
{
	"result" : [
		{
			"_id" : "wszystkie",
			"count" : 253854
		}
	],
	"ok" : 1
}
```
#### 1
```js
db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:1})
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
```
Procenty:
(1061396/17005207)*100 ~ 6.24

```
#### 10
```js
> db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:10})
{
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
Procenty:
(4205965/17005207)*100 ~ 24.73

```js
db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:10}, {$group:{_id:"wszystkie",count:{$sum:"$count"}}})
```
```json
{
	"result" : [
		{
			"_id" : "wszystkie",
			"count" : 4205965
		}
	],
	"ok" : 1
}

```
#### 100
```js
> db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:100})
```
```json
{
	"result" : [
		{
			"_id" : "the",
			"count" : 1061396
		},
		{
			"_id" : "of",
			"count" : 593677
		},
		//.
		//.
		//.
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
Wszystkie wyniki [tu](/docs/gmelzer/100.txt).

Procenty
(7998978/17005207)*100 ~ 47.04
```js
> db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:100}, {$group:{_id:"wszystkie",count:{$sum:"$count"}}})
```
```json
{
	"result" : [
		{
			"_id" : "wszystkie",
			"count" : 7998978
		}
	],
	"ok" : 1
}
```
#### 1000
```js
> db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:1000})
```
```json
{
	"result" : [
		{
			"_id" : "the",
			"count" : 1061396
		},
		{
			"_id" : "of",
			"count" : 593677
		},
		//.
		//.
		//.
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
Wszystkie wyniki [tu](/docs/gmelzer/1000.txt).

Procenty
(11433354/17005207)*100 ~ 67.23
```js
> db.text.aggregate({$group:{_id: "$word", count:{$sum:1}}},{$sort:{count:-1}},{$limit:1000}, {$group:{_id:"wszystkie",count:{$sum:"$count"}}})
```
```json
{
	"result" : [
		{
			"_id" : "wszystkie",
			"count" : 11433354
		}
	],
	"ok" : 1
}
```

### Zadanie 1e

----

Wykorzystałem dane od [Przemysława Królik](../data/pkrolik/E-Przesylka-PlacowkiPP-csv.csv) oraz stworzyłem pod przykład [skrypt](../scripts/gmelzer/skrypt.sh) shellowy do linuxa.

```
Oraz przerobiłem [skrypt](../scripts/gmelzer/zmiana.js) do zmiany danych w dokumencie.
Otrzymałem następujący plik wynikowy:
```json
{
	"_id" : ObjectId("5278089c5545d6682e588d65"),
	"PNI" : 243311,
	"woj" : "DOLNOŚLĄSKIE",
	"powiat" : "jaworski",
	"gmina" : "Jawor",
	"nazwa" : "UP Jawor 1",
	"miasto" : "Jawor",
	"ulica" : "ul. Kolejowa 13",
	"tel" : "76-850-03-81",
	"loc" : {
		"type" : "Point",
		"coordinates" : [
			16.197,
			51.054
		]
	}
}
```
Przykładowe zapytania:

```js
var wladek = {type: "Point", coordinates: [18.400,54.789]}
db.placowki.find({loc:{$near: {$geometry: wladek},$maxDistance: 5000}})
```
```json
{ 
	"_id" : ObjectId("5278089d5545d6682e5895af"), 
	"PNI" : 274460, 
	"woj" : "POMORSKIE", 
	"powiat" : "pucki", 
	"gmina" : "Władysławowo", 
	"nazwa" : "UP Władysławowo", 
	"miasto" : "Władysławowo", 
	"ulica" : "ul. Towarowa 2", 
	"tel" : "58-674-01-31", 
	"loc" : { 
		"type" : "Point", 
		"coordinates" : [  18.403215,  54.792051 ] 
	} 
}
```

tu można dowolność zrobić a i tak prawie się nie trafi:
```js
> db.placowki.find( {loc:  {$geoIntersects:  {$geometry: { type: "LineString", coordinates:  [[18.530,54.520], [18.559,54.439], [18.639,54.360], [19.040,54.040], [19.249,50.110], [20.600,49.969]]}}}}).count()
0
```
```js
var gdansk = {type: "Point", coordinates: [18.638,54.360]}
db.placowki.find({loc:{$near: {$geometry: wladek},$maxDistance: 30000},gmina:"Gdynia"})
```
```json
{ "_id" : ObjectId("5278089d5545d6682e589564"), "PNI" : 239731, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 18", "miasto" : "Gdynia", "ulica" : "ul. Komandora Bolesława Romanowskiego 24 A", "tel" : "58-665-71-23", "loc" : { "type" : "Point", "coordinates" : [  18.491959,  54.56243 ] } }
{ "_id" : ObjectId("5278089d5545d6682e58955c"), "PNI" : 239612, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 6", "miasto" : "Gdynia", "ulica" : "ul. Admirała Józefa Unruga 39", "tel" : "58-625-00-74", "loc" : { "type" : "Point", "coordinates" : [  18.503337,  54.552267 ] } }
{ "_id" : ObjectId("5278089d5545d6682e58955a"), "PNI" : 239593, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 4", "miasto" : "Gdynia", "ulica" : "ul. Chylońska 124", "tel" : "58-623-69-31", "loc" : { "type" : "Point", "coordinates" : [  18.462063,  54.545036 ] } }
{ "_id" : ObjectId("5278089d5545d6682e589568"), "PNI" : 239762, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 22", "miasto" : "Gdynia", "ulica" : "ul. Cechowa 8", "tel" : "58-625-13-22", "loc" : { "type" : "Point", "coordinates" : [  18.5141,  54.5508 ] } }
{ "_id" : ObjectId("5278089d5545d6682e589559"), "PNI" : 239586, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 3", "miasto" : "Gdynia", "ulica" : "ul. Podchorążych 10", "tel" : "58-625-07-35", "loc" : { "type" : "Point", "coordinates" : [  18.53647,  54.550645 ] } }
{ "_id" : ObjectId("5278089d5545d6682e58956a"), "PNI" : 239786, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 25", "miasto" : "Gdynia", "ulica" : "ul. Czeremchowa 2 B", "tel" : "58-623-50-19", "loc" : { "type" : "Point", "coordinates" : [  18.446675,  54.534292 ] } }
{ "_id" : ObjectId("5278089d5545d6682e589567"), "PNI" : 239755, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 21", "miasto" : "Gdynia", "ulica" : "ul. Ludwika Zamenhofa 15", "tel" : "58-623-05-32", "loc" : { "type" : "Point", "coordinates" : [  18.482882,  54.536288 ] } }
{ "_id" : ObjectId("5278089d5545d6682e58955e"), "PNI" : 239643, "woj" : "POMORSKIE", "powiat" : "Gdynia", "gmina" : "Gdynia", "nazwa" : "UP Gdynia 9", "miasto" : "Gdynia", "ulica" : "ul. Morska 106", "tel" : "58-620-74-02", "loc" : { "type" : "Point", "coordinates" : [  18.499888,  54.530219 ] } }

```

```js
> var polska = { type: "Polygon", coordinates: [[[14.400,54.789], [14.400,48.789], [24.400,48.789], [24.400,54.789], [14.400,54.789]]]}
> db.placowki.find( {loc:  {$geoIntersects:  {$geometry:  polska}}, woj: "POMORSKIE" }).count()
142
> db.placowki.find( {loc:  {$geoWithin: {$geometry: polska}}, woj: "POMORSKIE" }).count()
142
```

```js
db.placowki.aggregate({$match: {loc: {$geoWithin: {$geometry: polska}}}},{$group:{_id:"$woj",suma:{$sum: 1}}},{$sort: {suma:-1}})
```
```json
{
	"result" : [
		{
			"_id" : "MAZOWIECKIE",
			"suma" : 432
		},
		{
			"_id" : "LUBELSKIE",
			"suma" : 275
		},
		{
			"_id" : "ŚLĄSKIE",
			"suma" : 275
		},
		{
			"_id" : "DOLNOŚLĄSKIE",
			"suma" : 269
		},
		{
			"_id" : "WIELKOPOLSKIE",
			"suma" : 243
		},
		{
			"_id" : "ŁÓDZKIE",
			"suma" : 227
		},
		{
			"_id" : "ZACHODNIOPOMORSKIE",
			"suma" : 201
		},
		{
			"_id" : "KUJAWSKO-POMORSKIE",
			"suma" : 187
		},
		{
			"_id" : "MAŁOPOLSKIE",
			"suma" : 178
		},
		{
			"_id" : "PODKARPACKIE",
			"suma" : 154
		},
		{
			"_id" : "POMORSKIE",
			"suma" : 142
		},
		{
			"_id" : "ŚWIĘTOKRZYSKIE",
			"suma" : 138
		},
		{
			"_id" : "PODLASKIE",
			"suma" : 132
		},
		{
			"_id" : "LUBUSKIE",
			"suma" : 122
		},
		{
			"_id" : "WARMIŃSKO-MAZURSKIE",
			"suma" : 116
		},
		{
			"_id" : "OPOLSKIE",
			"suma" : 45
		}
	],
	"ok" : 1
}
```

```js
> db.placowki.aggregate({$match: {loc: {$geoWithin: {$geometry: polska}}, woj: "OPOLSKIE"}},{$group:{_id:"$gmina",suma:{$sum: 1}}},{$sort: {suma:-1}})
```
```json
{
	"result" : [
		{
			"_id" : "Opole",
			"suma" : 7
		},
		{
			"_id" : "Kędzierzyn-Koźle",
			"suma" : 3
		},
		{
			"_id" : "Nysa",
			"suma" : 3
		},
		{
			"_id" : "Brzeg",
			"suma" : 3
		},
		{
			"_id" : "Dąbrowa",
			"suma" : 1
		},
		{
			"_id" : "Skarbimierz",
			"suma" : 1
		},
		{
			"_id" : "Dobrzeń Wielki",
			"suma" : 1
		},
		{
			"_id" : "Gogolin",
			"suma" : 1
		},
		{
			"_id" : "Lewin Brzeski",
			"suma" : 1
		},
		{
			"_id" : "Wołczyn",
			"suma" : 1
		},
		{
			"_id" : "Lubsza",
			"suma" : 1
		},
		{
			"_id" : "Olesno",
			"suma" : 1
		},
		{
			"_id" : "Głubczyce",
			"suma" : 1
		},
		{
			"_id" : "Namysłów",
			"suma" : 1
		},
		{
			"_id" : "Głuchołazy",
			"suma" : 1
		},
		{
			"_id" : "Łubniany",
			"suma" : 1
		},
		{
			"_id" : "Ozimek",
			"suma" : 1
		},
		{
			"_id" : "Strzelce Opolskie",
			"suma" : 1
		},
		{
			"_id" : "Kluczbork",
			"suma" : 1
		},
		{
			"_id" : "Paczków",
			"suma" : 1
		},
		{
			"_id" : "Praszka",
			"suma" : 1
		},
		{
			"_id" : "Zawadzkie",
			"suma" : 1
		},
		{
			"_id" : "Tarnów Opolski",
			"suma" : 1
		},
		{
			"_id" : "Dobrodzień",
			"suma" : 1
		},
		{
			"_id" : "Leśnica",
			"suma" : 1
		},
		{
			"_id" : "Prudnik",
			"suma" : 1
		},
		{
			"_id" : "Grodków",
			"suma" : 1
		},
		{
			"_id" : "Komprachcice",
			"suma" : 1
		},
		{
			"_id" : "Głogówek",
			"suma" : 1
		},
		{
			"_id" : "Korfantów",
			"suma" : 1
		},
		{
			"_id" : "Krapkowice",
			"suma" : 1
		},
		{
			"_id" : "Prószków",
			"suma" : 1
		},
		{
			"_id" : "Niemodlin",
			"suma" : 1
		}
	],
	"ok" : 1
}

```