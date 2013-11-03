### *Michał Dępczyk*

----
```
MongoDB shell version: 2.4.7
```
Parametry komputera:
```
-Computer-
Processor		: 8x Intel(R) Core(TM) i7-2670QM CPU @ 2.20GHz
Memory		: 8086MB

-SCSI Disks-
ATA SAMSUNG HN-M101M
Slimtype BD E DS6E2SH
```
### Zadanie 1a

Przygotowanie pliku za pomocą skryptu 2unix:

```
time bash 2unix.sh Train.csv Trainunix.csv
```

Wynik:

```
real	14m7.867s
user	0m53.591s
sys	1m33.370s
```
Import bazy:

```
time mongoimport --type csv -c Train --file Trainunix.csv --headerline
```

Wynik:

```
real	7m43.797s
user	1m30.870s
sys	0m13.917s
```

### Zadanie 1b

```
db.Train.count()
```

6034195

### Zadanie 1c

```
db.Train.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.Train.save(x);
}});
```
Różne tagi:
```
db.Train.distinct("tags").length
```
42048

Wszystkie tagi:
```
{
  "result" : [
     {
        "_id" : "result",
        "count" : 17409994
     }
  ],
  "ok" : 1
}
```
### Zadanie 1d

EDA

```
tr --delete '[:alnum:][:blank:]' < text8 > deleted.txt
ls -l deleted.txt
```

```
wc text8
  0         17005207 100000000 text8
tr --squeeze-repeats '[:blank:]' '\n' < text8 > text8.txt
wc text8.txt
  17005207  17005207 100000000 text8.txt
```

```
sed 1d text8.txt | sed '1s/^/word\n/' > text8.csv
```

```
time mongoimport --type csv -c text8 --file text8.csv --headerline
```

```
real	7m22.430s
user	0m42.691s
sys	0m7.592s
```

Ilość wszystkich słów:

```
db.text8.count()
```
17005207

Ilość różnych słów:

```
db.text8.distinct("word").length
```
253854


Najczęstsze słowo:
```
db.text8.aggregate([ {$group:{ _id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1} ])
```
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }


10 najczęstszych słów:
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }


100 najczęstszych słów:
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:100}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```
{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }


1000 najczęstszych słów:
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1000}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```
{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }
### Zadanie 1e

Znalazłem baze danych Texasu - obiekty, zabytki na jego terenie.

```
mongoimport --db geo --collection texas --file texas.json --jsonArray
```
db.geo.count()
112914

```
db.geo.ensureIndex({"loc" : "2dsphere"});
```

```
var ptk = { 
    "type" : "Point", 
    "coordinates" : [ -98.887939453125,31.77020763186669 ] 
};

```

```
db.geo.find({ loc: {$near: {$geometry: ptk}, $maxDistance: 2200} }).toArray()
```

Wynik:
```
[
	{
		"_id" : ObjectId("5274f3515bd6a5e34d00c991"),
		"id" : 1859729,
		"name" : "Soil Conservation Service Site 19 Dam",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8703265,
				31.7584843
			]
		}
	},
	{
		"_id" : ObjectId("5274f3515bd6a5e34d00c992"),
		"id" : 1859730,
		"name" : "Soil Conservation Service Site 19 Reservoir",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8689226,
				31.7599604
			]
		}
	}
]
```

```
db.geo.find({  loc: {$geoWithin : { $center : [ [ -98.887939453125,31.77020763186669  ] , 0.05 ] } } }).toArray();
```

Wynik:
```
[
	{
		"_id" : ObjectId("5274f6b359756053c6341679"),
		"id" : 1331380,
		"name" : "Brownwood Lateral Watershed Number 20",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8530432,
				31.7488501
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b359756053c6342453"),
		"id" : 1334935,
		"name" : "East Fork Steppes Creek",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.883382,
				31.7254302
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b359756053c63424c2"),
		"id" : 1335046,
		"name" : "Eastlawn Cemetery",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9050492,
				31.7568178
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b459756053c634330b"),
		"id" : 1338705,
		"name" : "Jenkings Spring",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8575483,
				31.7426516
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b459756053c6343398"),
		"id" : 1338846,
		"name" : "Jones Chapel",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9114381,
				31.7551512
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b459756053c6343399"),
		"id" : 1338847,
		"name" : "Jones Chapel Cemetery",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9100494,
				31.7620954
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b459756053c63442c8"),
		"id" : 1342742,
		"name" : "North Fork Steppes Creek",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8786596,
				31.7237636
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b459756053c634505d"),
		"id" : 1346229,
		"name" : "Salt Creek Church",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9008841,
				31.8154274
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c634cca8"),
		"id" : 1378204,
		"name" : "Delaware Junction",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8689383,
				31.7865392
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c635082a"),
		"id" : 1859721,
		"name" : "Soil Conservation Service Site 20 Dam",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8469926,
				31.7518179
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c635082b"),
		"id" : 1859722,
		"name" : "Soil Conservation Service Site 20 Reservoir",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8469926,
				31.7518179
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c6350832"),
		"id" : 1859729,
		"name" : "Soil Conservation Service Site 19 Dam",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8703265,
				31.7584843
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c6350833"),
		"id" : 1859730,
		"name" : "Soil Conservation Service Site 19 Reservoir",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8689226,
				31.7599604
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c6350837"),
		"id" : 1859735,
		"name" : "Soil Conservation Service Site 17 Dam",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.921995,
				31.7968168
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b659756053c6350838"),
		"id" : 1859736,
		"name" : "Soil Conservation Service Site 17 Reservoir",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9200437,
				31.797094
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b759756053c6351ece"),
		"id" : 1889805,
		"name" : "Jenkins Cemetery",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8611594,
				31.7412628
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b759756053c6352a90"),
		"id" : 2003852,
		"name" : "Early Elementary School",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9300494,
				31.7490402
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b759756053c63550f3"),
		"id" : 2014787,
		"name" : "Pioneer Memorial Library",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.8728263,
				31.7523734
			]
		}
	},
	{
		"_id" : ObjectId("5274f6b959756053c635bd91"),
		"id" : 2675765,
		"name" : "Flying S Air Ranch Airport",
		"loc" : {
			"type" : "Point",
			"coordinates" : [
				-98.9090467,
				31.783621
			]
		}
	}
]
```

```
var area = { "type" : "Polygon", "coordinates" : [ [ [ -99 , 32 ], [ -98 , 32 ], [ -98 , 31.5 ], [ -99 , 31.5 ], [ -99 , 32 ] ] ]};
```

```
db.geo.find({ loc : { $geoIntersects : { $geometry : area } } }).count();

```

Wynik:
803


```
var line = {"type": "LineString",  "coordinates": [[ -99 , 31 ] , [ -98 , 32 ]]};
```

```
db.geo.find({ loc : { $geoIntersects : { $geometry : line } } }).count();
```

Wynik:
0

10 najbliższych miejsc:

```
db.geo.find({ loc: {$near: {$geometry: ptk}} }).skip(1).limit(10).toArray()
```
```
db.geo.find( {loc:  {$geoIntersects:  {$geometry: { type: "LineString", coordinates:  [[98.887939453125,31.77020763186669 ], [98.227939453125,31.72420763186669 ], [98.884569453125,31.33330763186669 ], [99.887939453125,31.76020763186669 ]]}}}}).count()
```
Wynik:
0
