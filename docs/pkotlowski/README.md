### *Piotr Kotłowski*

----

## Zadanie 1
### a) Import danych z pliku CSV do bazy danych
Import za pomocą:
```
time mongoimport -d zadanie -c zadanie -type csv -file ~/Pulpit/Train.csv --headerline
```
rezultat:
```
imported 6034195 objects

real	17m49.713s
user	2m27.057s
sys	0m34.514s
```
Użycie zasobów:
![img](http://i44.tinypic.com/4tn5li.png)
### b) Zliczanie ilośći zaimportowanych rekordów
```
db.zadanie.count();
```
rezultat:
```
6034195
```
### c) Zamienić string z tagami na tablice stringów

[Skrypt](/docs/pkotlowski/fix_train.js) do zamieniania stringów na tablice

Wynik:
```
Razem tagów: 17408733
Unikalnych tagów: 42048

real    18m4.539s
user    3m12.759s
sys 0m35.100s
```

### d) Import z pliku do bazy danych
Import za pomocą:
```
time mongoimport --type csv -f word -d text8 -c text8 --file ./text8.txt
```
Rezultat:
```
imported 17005207 objects

real	19m30.787s
user	0m52.357s
sys	0m17.396s
```
Użycie zasobów:
![img](http://oi42.tinypic.com/16i9swk.jpg)

Zliczanie wszystkich słów za pomocą ``` db.text8.count() ``` daje rezultat ``` 17005207 ```

Zliczanie wszystkich unikalnych słów za pomocą ``` db.text8.distinct("word").length ``` daje rezultat ``` 253854 ```

Zliczanie 1/10/100/1000 najczęściej występujących słów:
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:ZADANA_ILOSC}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```

Procentowy udział słów w bazie
-------------

<table>
  <tr>
    <th>Ilość</th><th>Suma</th><th>Słowo(a)</th><th>Udział procentowy</th>
  </tr>
  <tr>
    <td>1</td><td>1061396</td><td>the</td><td>6,25%</td>
  </tr>
  <tr>
    <td>10</td><td>4205965</td><td> [klik](/docs/pkotlowski/10.md) </td><td>24,73%</td>
  </tr>
 <tr>
    <td>100</td><td>7998978</td><td> [klik](/docs/pkotlowski/100.md) </td><td>47,03%</td>
  </tr>
 <tr>
    <td>1000</td><td>11433354</td><td> [klik](/docs/pkotlowski/1000.md) </td><td>67,23%</td>
  </tr>
</table>

### e) Import geoJSON'ów do bazy danych.
Dane pochodzą z http://geonames.usgs.gov/docs/stategaz/NationalFile_20131020.zip

Na początek należy zamienić ```|``` na ```,```. Wykorzystałem do tego leafpada ```find and replace```

Import za pomocą:
```
time mongoimport -d geo -c geo -type csv -file NationalFile_20131020_poprawiony.txt --headerline

```
Rezultat:
```
imported 2251155 objects

real	3m30.615s
user	0m44.968s
sys	0m4.595s

```
Użycie zasobów:
![img](http://oi42.tinypic.com/16i9swk.jpg)

Zaimportowano ```2251155``` rekordów

Następnie wybrałem najbardziej interesujące mnie dane takie jak: Nazwa, typ, wysokość oraz współżędne geograficzne. Reszta rekordów została usunięta. Wykorzystałem do tego [Skrypt](/docs/pkotlowski/geo.js). Działa on na zasadzie kopiowania z kolekcji geo wybranych atrybutów do kolekcji geo_points

Następnie należy oczyścić bazę z rekordów w niewłaściwym formacie. Służy do tego skrypt [JavaScript](/docs/pkotlowski/remove-geo.js)
```deleted 587 records```
Zapytanie 1: Wszystkie obiekty w odległości 3000m od współżędnych -109.4784394,  36.4611122 
```db.geo_points.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 3000} }).toArray()```
```json
Agua Sal Creek
Stream
{ "type" : "Point", "coordinates" : [ -109.4784394, 36.4611122 ] }
1645
-----------
Broken Iron Spring
Spring
{ "type" : "Point", "coordinates" : [ -109.4587169, 36.4722232 ] }
1658
-----------
Salt Water Cone
Summit
{ "type" : "Point", "coordinates" : [ -109.4528834, 36.4472234 ] }
1754
-----------
Bihilinie Canyon
Valley
{ "type" : "Point", "coordinates" : [ -109.4531612, 36.4447234 ] }
1710
-----------
```

Zapytanie 2: 10 najwyższych szczytów o wysokości co najmniej 1000m najbliżej punktu -110.3795443,  33.4794988 
```db.geo_points.find({ loc: {$near: {$geometry: punkt}}, type:"Summit", height: {$gt:1000} }).sort({height: -1}).limit(10)```
```json
Churchill Peaks
Summit
{ "type" : "Point", "coordinates" : [ -151.0060501, 63.0693461 ] }
6186
-----------
Mount McKinley
Summit
{ "type" : "Point", "coordinates" : [ -151.0060501, 63.0693461 ] }
6186
-----------
South Peak
Summit
{ "type" : "Point", "coordinates" : [ -151.0060501, 63.0693461 ] }
6186
-----------
North Peak
Summit
{ "type" : "Point", "coordinates" : [ -151.0050201, 63.0972441 ] }
5920
-----------
Archdeacons Tower
Summit
{ "type" : "Point", "coordinates" : [ -151.0197222, 63.0738889 ] }
5911
-----------
Mount Saint Elias
Summit
{ "type" : "Point", "coordinates" : [ -140.928976, 60.293754 ] }
5471
-----------
Mount Foraker
Summit
{ "type" : "Point", "coordinates" : [ -151.3980556, 62.9608333 ] }
5286
-----------
Mount Bona
Summit
{ "type" : "Point", "coordinates" : [ -141.7486111, 61.3855556 ] }
5003
-----------
Mount Sanford
Summit
{ "type" : "Point", "coordinates" : [ -144.1288889, 62.2138889 ] }
4926
-----------
Mount Blackburn
Summit
{ "type" : "Point", "coordinates" : [ -143.4330556, 61.7316667 ] }
4866
-----------
```

Zapytanie 3: Wszystkie lotniska między Nebraska, Omaha, Indianapolis oraz Chicago
```
db.geo_points.find( { loc :
                  { $geoWithin :
                    { $geometry :
                      { type : "Polygon" ,
                        coordinates: [ [ [ -95.9979,41.2524 ] , [ -98.0000,38.5000, ] , [ - 86.1480,39.7910] , [ -87.6279,41.8819 ],[ -95.9979,41.2524 ] ] ]
                } } },
			type: "Airport"} )
```

Rezultat: [klik!](/docs/pkotlowski/lotniska.md)

Zapytanie 4: Wszystkie obiekty w linii prostej między Churchil Peaks a Mount Saint Elias
```
db.geo_points.find( {loc: 
	{$geoIntersects: 
		{$geometry: 
			{type: "LineString", coordinates: [ [ -140.928976, 60.293754], [-151.0060501, 63.0693461] ]}}}})
```
Zapytanie 5: Wszystkie kopalnie leżące do 50km od Las Vegas położone na wysokości co najmniej 2000m
```
db.geo_points.find({ loc: 
	{$near: 
		{$geometry: 
			{type: "Point", coordinates: [-115.1522,36.0800]}}, 
				$maxDistance : 50000  },
	type: "Mine",
	height: {$gt:2000} })
```

Rezultat:
```json
Double Up Mine
Mine
{ "type" : "Point", "coordinates" : [ -115.4863927, 35.9441395 ] }
2242
-----------
Potosi Mine
Mine
{ "type" : "Point", "coordinates" : [ -115.5366725, 35.9621939 ] }
2005
-----------
Lucky Strike Mine
Mine
{ "type" : "Point", "coordinates" : [ -115.5397364, 36.3349641 ] }
2018
-----------
Griffith Mine
Mine
{ "type" : "Point", "coordinates" : [ -115.6372393, 36.2710744 ] }
2446
-----------

```
<script src="https://embed.github.com/view/geojson/pkotlowski/aggregations-2/blob/master/docs/pkotlowski/1.5.geojson">Mapa</script>

Zapytanie 6: Ilość szkoł leżących 3000m od centrum Chicago.
```
db.geo_points.find({ loc: {$near: {$geometry: {
          type: "Point", coordinates: [-87.6278,41.8819]
          }}, $maxDistance: 3000},
          type:"School" }).count()
```
```json
202
```