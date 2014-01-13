# Zadanie 1 #

### a) zaimportuj do mongoDB dane z bazy Train.csv ###

#### Wykonanie tego zadania rozpoczalem od przygotowania pliku Train.csv, co polegalo na usunieciu znakow nowej linii. Wykonalem to przy pomocy udostepnionego skryptu 2unix.sh ####
  
<br>
```
time ./2unix.sh Train.csv Train_new.csv 

Skrypt wykonal sie w czasie:
real    21m42.845s
user     0m46.008s
sys         2m06.643s
```
<br>
#### Kolejnym krokiem bylo wykonanie operacji importu danych z pliku do bazy ####
<br>
```
time ./../mongodb/bin/mongoimport --type csv -c Train --file Train_new.csv --headerline

Import wykonal sie w czasie:
real    12m22.195s
user 	 2m28.232s
sys	     0m24.603s
```

<br>
#### Jak widać na ponizszym obrazku, podczas importu zuzycie procesora bylo na poziomie ~60%, a czasami wynosilo nawet 100% ####
<br>

 [![Alt text](https://dl.dropboxusercontent.com/u/10832006/usage.png)](http://example.net/)

<br>
### b) Zlicz liczbe zaimportowanych rekordow ###
<br>
```
> db.Train.count()
6034195
```

<br>
### c) Ściągnąć plik text8.zip, zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz liczbę różnych słów w tym pliku. Ile procent całego pliku stanowi 10, 100, 1000 najczęściej występujących słów w tym pliku ###
<br>

#### Wykonalem zgodnie z wskazowkami wszytskie operacje na pliku text8.txt ####

```
time ./../mongodb/bin/mongoimport --db txt8_2 --collection txt8_2 --file text8.txt--fields word --type csv 

use text8_2
switched to db text8_2
> db.text8_2.count()

17005207

Przykladowy rekord z podanej bazy :
> db.text8_2.findOne()
{ "_id" : ObjectId("52d30be6f758821ed49a585d"), "word_2" : "anarchism" }
```
#### Zgodnie z trescia zadania, wykonalem agregacje na tym zbiorze danych by uzyskac 1,10,100 oraz 1000 najczesciej wystepujacych slow ####
<br>
#### Unikalnych slow w bazie jest :  ####
```
db.text8_2.distinct("word_2").length
>253854
```

#### Stworzylem agregacje aby wylowic ilosc powtorzen tych najczesciej wystepujacych ilosci slow  ####

```
> db.text8_2.aggregate(
   [ {$group:{_id:"$word_2", count:{$sum:1}}},
     {$sort: {count: -1}},
     {$limit:10},
     {$group:{_id: null, count:{$sum:"$count"}}} ])
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }
```

#### Ponizsza tabela przedstawia wszytskie wyniki  ####
<br>

 Limit | Ilosc slów | Procentowo 
:----------:|:-----------:|:------------:
 1       |        1061396 |     6,24%     
 10     |      4205965 |    24,73%    
 100       |        7998978 |     47%     
 1000         |          11433354 |      67%      
  

# Zadanie 2 #

## mongoDB ##

Skorzystalem z udostepnionej bazy GetGlue.
Wycialem z niej drugi milion rekordów przy pomocy komendy :

```
time head -n 2000000 getglue_sample.json | tail -n 1000000 > getglue.json

real    1m19.886s
user	0m30.866s
sys	0m1.998s

> db.getglue.count()
1000000

```

### Agregacja 1 ###
#### Sprawdzam jaki najczesciej rezyser wystepuje w podanym milionie rekordow filmow. Chce uzyskac 10 najbardziej popularnych, wlacznie z tymi rekordami w ktorych tej informacji nie ujawniono. W tym przypadku beda one mialy znacznik "Nie podano" ####

```
> db.getglue.aggregate(
    {$group:{_id: {
     $ifNull: ["$director","Nie podano"]}, count:{$sum: 1}}},
    {$sort:{count: -1}},{$limit: 10});
{
    "result" : [
		{
			"_id" : "Nie podano",
			"count" : 553904
		},
		{
			"_id" : "david yates",
			"count" : 7466
		},
		{
			"_id" : "steven spielberg",
			"count" : 6187
		},
		{
			"_id" : "todd phillips",
			"count" : 5817
		},
		{
			"_id" : "tim burton",
			"count" : 5237
		},
		{
			"_id" : "john lasseter",
			"count" : 4515
		},
		{
			"_id" : "james cameron",
			"count" : 4472
		},
		{
			"_id" : "martin campbell",
			"count" : 4379
		},
		{
			"_id" : "robert zemeckis",
			"count" : 4103
		},
		{
			"_id" : "christopher nolan",
			"count" : 4011
		}
	],
	"ok" : 1
}

```
 [![Alt text](https://dl.dropboxusercontent.com/u/10832006/wykres1.png)](http://example.net/)

### Agregacja 2 ###
#### Sprawdzam w jakim miesiacu w naszej bazie zarejestrowano najwiecej filmow ze znacznikami Liked. Wylistuje TOP3 ####

```
> db.getglue.aggregate({$match: {action : "Liked"}},{$project:{year: {$substr:["$timestamp",0,7]}}},{$group:{_id: "$year", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 3});
{
    "result" : [
		{
			"_id" : "2011-06",
			"count" : 110662
		},
		{
			"_id" : "2011-05",
			"count" : 110409
		},
		{
			"_id" : "2011-04",
			"count" : 102052
		}
	],
	"ok" : 1


```
 [![Alt text](https://dl.dropboxusercontent.com/u/10832006/wykres2.png)](http://example.net/)

## elasticSearch ##

#### Do importu wszystkich danych do ES uzywam  `Bulk Api', które wymaga JSON'ow o określonej strukturze:  ####
<br>
```
{ "index": { "_type": "type name" } } // nazwa typu, do którego chcemy dodać dokument
{ "field": "content" ... } // dokument

```
#### wykonalem to za pomoca komendy  ####

```
time cat getglue.json | ./jq --compact-output '{ "index": { "_type": "getglue" } }, .' > getglue.bulk

Wszytsko wykonalo sie w czasie :

real    1m41.827s
user	1m22.927s
sys	     0m6.782s

```

#### nastepnie dodalem ####

```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @getglue.bulk

real    28m54.213s
user	0m0.185s
sys	0m1.847s

```

### Agregacja 3 ###
#### Listuje TOP5 wedlug uzytkownikow ktorzy maja filmy z najwieksza liczba like'ow ####

```
{
    "query" : {
        "query_string" : {
          "query" : "action:Liked"
      }
    },
    "facets" : {
        "userId" : {
            "terms" : {
                "field" : "userId",
                "size" : 5
            }
        }
    }
}

{

    took: 141
    timed_out: false
    _shards: {
        total: 5
        successful: 5
        failed: 0
    }
    hits: {
        total: 752493
        max_score: 1.4685009
        hits: [
            {
                _index: getglue
                _type: getglue
                _id: p7pJumoZRniUjfjbleuCZg
                _score: 1.4685009
                _source: {
                    app: GetGlue
                    visitCount: 1
                    private: false
                    userId: aka_sulley
                    image: http://cdn-5.nflximg.com/us/boxshots/large/60029415.jpg
                    timestamp: 2009-12-17T23:19:51Z
                    title: Return From Witch Mountain
                    displayName: Kevin Sullivan
                    modelName: movies
                    hideVisits: false
                    director: john hough
                    source: glue://suggestions
                    version: 2
                    link: http://www.netflix.com/Movie/Return_From_Witch_Mountain/60029415
                    lastModified: 2011-12-16T19:48:27Z
                    action: Liked
                    lctitle: return from witch mountain
                    objectKey: movies/return_from_witch_mountain/john_hough
                }
            }
    .
    .
    .
    .
    .
    

    facets: {
        userId: {
            _type: terms
            missing: 0
            total: 752514
            other: 720139
            terms: [
                {
                    term: jesusvarelaacosta
                    count: 8615
                }
                {
                    term: johnnym2001
                    count: 7541
                }
                {
                    term: khairulazmas
                    count: 6903
                }
                {
                    term: s3v3ns
                    count: 5760
                }
                {
                    term: endika
                    count: 3556
                }
            ]
        }
    }

}




```
 [![Alt text](https://dl.dropboxusercontent.com/u/10832006/wykres3.png)](http://example.net/)

### Agregacja 4 ###
#### Sprawdzam ile filmow ma liczbe wejsc od 1 do 10 ####


```
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "visitCount" : {
            "terms" : {
                "field" : "visitCount",
                "size" : 10
            }
        }
    }
}




    took: 248
    timed_out: false
    _shards: {
        total: 5
        successful: 5
        failed: 0
    }
    hits: {
        total: 999934
        max_score: 1
        hits: [
            {
                _index: getglue
                _type: getglue
                _id: L8lVvbKTRnu0aEjl_qvtGw
                _score: 1
                _source: {
                    app: GetGlue
                    visitCount: 1
                    private: false
                    userId: s3v3ns
                    image: http://cdn-4.nflximg.com/us/boxshots/large/60004234.jpg
                    timestamp: 2010-03-04T04:01:33Z
                    title: Elmer Gantry
                    displayName: Ben Nelson
                    modelName: movies
                    hideVisits: false
                    director: richard brooks
                    source: glue://users/BillBateman/recent_things?displayName=Bill Bateman
                    version: 2
                    link: http://www.netflix.com/Movie/60004234
                    lastModified: 2011-12-16T20:00:20Z
                    action: Liked
                    lctitle: elmer gantry
                    objectKey: movies/elmer_gantry/richard_brooks
                }
            }
            {
                _index: getglue
                _type: getglue
                _id: nz9oknMSTeSa3bxa4GlDRA
                _score: 1
                _source: {
                    app: GetGlue
                    visitCount: 1
                    private: false
                    userId: s3v3ns
                    image: http://graphics8.nytimes.com//images/section/movies/amg/dvd/cov150/drt100/t196/t19630ouxz2.jpg
                    timestamp: 2010-03-04T04:01:41Z
                    title: The Women
                    displayName: Ben Nelson
                    modelName: movies
                    hideVisits: false
                    director: george cukor
                    source: glue://users/BillBateman/recent_things?displayName=Bill Bateman
                    version: 2
                    link: http://movies2.nytimes.com/gst/movies/movie.html
                    lastModified: 2011-12-16T20:00:20Z
                    action: Liked
                    lctitle: the women
                    objectKey: movies/women/george_cukor
                }
            }
    .
    .
    .
    .
    .
    
    facets: {
        visitCount: {
            _type: terms
            missing: 2857
            total: 997077
            other: 2364
            terms: [
                {
                    term: 1
                    count: 937164
                }
                {
                    term: 2
                    count: 38675
                }
                {
                    term: 3
                    count: 8733
                }
                {
                    term: 4
                    count: 3843
                }
                {
                    term: 5
                    count: 2144
                }
                {
                    term: 6
                    count: 1382
                }
                {
                    term: 7
                    count: 948
                }
                {
                    term: 8
                    count: 871
                }
                {
                    term: 9
                    count: 518
                }
                {
                    term: 10
                    count: 435
                }
            ]
        }
    }

}

```
 [![Alt text](https://dl.dropboxusercontent.com/u/10832006/wykres4.png)](http://example.net/)
