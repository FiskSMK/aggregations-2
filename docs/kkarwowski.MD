[Zadanie 1A](#zadanie-1a)<br />
[Zadanie 1B](#zadanie-1b)<br />
[Zadanie 1C](#zadanie-1c)<br />
[Zadanie 1D](#zadanie-1d)<br />
[Zadanie 1E](#zadanie-1e)

----
# Zadanie 1a

Po poprawieniu pliku *Train.csv*, importuję go za pomocą polecenia 
```sh
time mongoimport --db Train --collection Train --type csv --file ./Train.csv --headerline
```
### Wynik
Polecenie zajęło 10minut i 8 sekund (608 000 ms)

<br />
# Zadanie 1b
### Czas
10m 8s (608s, 608 000ms)

### Wynik
Łącznie zostało zaimportowanych *6034195* rekordów.
<br />
# Zadanie 1d

### Opis
Po przygotowaniu danych z pliku [text8.zip](http://mattmahoney.net/dc/text8.zip), zaimportowałem je do bazy MongoDB o nazwie *lab* i kolekcji *lab*.

### Polecenie
Wykorzystałem do tego polecenie *mongoimport* z wykorzystaniem komendy *time* mierzącej czas operacji:

```sh
time mongoimport --db lab --collection lab --file text8.txt --fields word --type csv
```

### Czas
Całość procesu zajęła 11 minut i 38 sekund (698 000 ms).

### Wyniki
Ilość wszystkich słów wynosi 17005207. Wykorzystałem do tego polecenie:
```sh
db.lab.count()
```

Ilość różnych słów to 253854. Polecenie:
```sh
db.lab.distinct("word").length
```
<b>Top 1</b><br />
Najczęściej występującym słowem było słowo *the*, które pojawiło się 1061396 razy oraz stanowi 6.24% całości. 
```sh
db.lab.aggregate(
	{ $group: { _id: "$word", count: { $sum: 1 } } } , 
	{ $sort: { count: -1 } }, 
	{ $limit: 1 })
)
```
<b>Top 10</b><br />
10 najczęściej występujących słów to:
the, of, and, one, in, a, to, zero, nine, two
Stanowią one łącznie 25% wszystkich słów.

![graph](http://kk12.pl/nosql/graph.png)


Polecenie:
```sh
db.lab.aggregate(
	{ $group: { _id: "$word", count: { $sum: 1 } } } , 
	{ $sort: { count: -1 } }, 
	{ $limit: 10 })
)
```

<b>Top 100</b><br />
Jest ich łącznie 7998978 oraz liczą 47% łącznej liczby.
```sh
db.lab.aggregate(
	{ $group: { _id: "$word", count: { $sum: 1 } } } , 
	{ $sort: { count: -1 } }, 
	{ $limit: 100 })
)
```

<b>Top 1000</b><br />
Dzięki 11433354 wystąpieniom, wspólnie zajmują 67% bazy.
```sh
db.lab.aggregate(
	{ $group: { _id: "$word", count: { $sum: 1 } } } , 
	{ $sort: { count: -1 } }, 
	{ $limit: 1000 })
)
```
<br />
# Zadanie 1e


### Opis
Zadanie ma na celu wykorzystanie MongoDB do obsługi obiektów GeoJSON. W tym celu, wykorzystałem plik z danymi zawierający lokalizacje huraganów w 2004 na Atlantyku. [Źródło pliku](https://github.com/colemanm/hurricanes/blob/master/fl_2004_hurricanes.geojson) oraz [źródło danych](weather.unisys.com/hurricane/atlantic/2004H/index.html).

Przykładowy wpis:
```sh
{ 
	"type": "Feature",
	"properties": { "ADV": "41", "LAT": 19.000000, "LON": -81.500000, "TIME": "09\/12\/15Z", "WIND": 135, "PR": 919, "STAT": "HURRICANE-4", "NAME": "Ivan", "DATES": "02-24 SEP 2004" },
	"geometry": { "type": "Point", "coordinates": [ -81.500000, 19.000000 ] } 
}
```

Do importu 
wykorzystałem polecenie:
```sh
time mongoimport --db hurricanes -collection hurricanes --type json --file fl_2004_hurricanes.geojson
```

### Dane
Do bazy *hurricanes*, kolekcji *hurricanes* zostało zaimportowanych 652 rekordów w czasie 13 sekund (13 000 ms).

### Wynik
Dodawanie geo-indeksów:
```sh
db.hurricanes.ensureIndex({"geometry" : "2dsphere"})
```
<br />
<b>*$near*</b><br />
Huragan o współrzędnych [135,20]
```sh
db.hurricanes.findOne({ geometry: {$near: {$geometry: {	type: "Point", 
														coordinates: [135,20]}}} })
```

Huragan w pobliżu [135,20]
```sh
db.hurricanes.find({ geometry: {$near: {$geometry: {	type: "Point", 
														coordinates: [135,20]}}} })
```


Najbliższy huragan w pobliżu punktu, maksymalnie oddalony o 1 kilometr
```sh
var punkt = {type: "Feature", coordinates: [19,-60]}
db.hurricanes.findOne({ loc: {$near: {	$geometry: punkt},
										$maxDistance: 1/111.12} })
```

10 huraganów w pobliżu 1 kilometra od współrzędnych [135,-20]. Wyniki zawierają unikalne wyniki oraz obliczoną odległość i współrzędne użytej lokalizacji.
```sh
db.hurricanes.aggregate([ { $geoNear: {
										near: [135.00, -20.00],
										distanceField: "dist.calculated",
										maxDistance: 1/111.12,
										query: { type: "Point" },
										includeLocs: "dist.location",
										uniqueDocs: true,
										num: 10
                                  } }])
```

<br />
<b>*$geoWithin*</b><br />
Huragany występujące w obszarze Trójkąta Bermudzkiego
```sh
db.hurricanes.find( { loc : { $geoWithin : { $polygon :	[ [ 25.774252 , -80.190262 ] ,
														[ 18.466465 , -66.118292 ] ,
														[ 25.774252 , -80.190262 ] ,
														[ 25.774252 , -80.190262 ] , ] } } } )
```	

Współrzędne huraganów IVAN w Trójkącie Bermudzkim
```sh
db.hurricanes.find( { loc : { $geoWithin : { $polygon :	[ [ 25.774252 , -80.190262 ] ,
														[ 18.466465 , -66.118292 ] ,
														[ 25.774252 , -80.190262 ] ,
														[ 25.774252 , -80.190262 ] , ] } },
					"name": { "IVAN" }})
```

Ilość huraganów znajdujących się w kole o promieniu 1 kilometra, którego środek ma współrzędne [135, 20]
```sh
punkt = [135, 20];
promien = 1/111.12;
db.hurricanes.count({ loc : { $geoWithin : { $center: [punkt, promien]}}})
```

To samo co wyżej, tylko zawiera wyniki
```sh
punkt = [135, 20];
promien = 1/111.12;
db.hurricanes.find( { loc: { $geoWithin: { $centerSphere: [ punkt , promien ] } } } )
```

<br />
<b>*$geoIntersects*</b><br />
Huragany leżące na linii 
```
db.hurricanes.find( { loc : { $geoIntersects : { $geometry : { type : 	"LineString" ,
																		coordinates: [ [ [ 39 , -60 ] , [ 39 , -40 ] ] ] } } } } } )
```			

															
