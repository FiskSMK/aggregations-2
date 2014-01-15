# Michał Ostrowski
*****************************
## Zadanie 2
* * * *

##Użyta baza to getglue

##MongoDB

Z pliku getglue_sample.json wyciąłem 1,2mln rekordów zapisując je w pliku getglue_sample_small.json za pomocą polecenia:

```
head -n 1200000 getglue_sample.json > ../NoSQL/getglue_sample_small.json
```

Wykonałem import bazy do MongoDB za pomocą polecenia:

```
time mongoimport -d test -c getglue --file ../getglue_sample_small.json
```

Czas importowania:

```
real    4m10.922s
user	2m52.856s
sys     1m1.364s
```

*****

##Agregacje:
###1. 15 użytkowników, którzy dodali najwięcej filmów:

```
db.getglue.aggregate(
    { $group:{ _id: "$userId", count: { $sum: 1 } }             },
    { $sort: { count: -1 } },
    { $limit: 15 }
)
```

###Wynik:

```
"result" : [
    	{
			"_id" : "jesusvarelaacosta",
			"count" : 9924
		},
		{
			"_id" : "khairulazmas",
			"count" : 9734
		},
		{
			"_id" : "johnnym2001",
			"count" : 8150
		},
		{
			"_id" : "endika",
			"count" : 7107
		},
		{
			"_id" : "s3v3ns",
			"count" : 5774
		},
		{
			"_id" : "adoria",
			"count" : 5449
		},
		{
			"_id" : "samnaeev",
			"count" : 5357
		},
		{
			"_id" : "tedi31",
			"count" : 5292
		},
		{
			"_id" : "StefanGoldby",
			"count" : 4997
		},
		{
			"_id" : "SusantiBharuna",
			"count" : 4583
		},
		{
			"_id" : "darylrosemd",
			"count" : 4572
		},
		{
			"_id" : "indra17",
			"count" : 4554
		},
		{
			"_id" : "kharisma",
			"count" : 4551
		},
		{
			"_id" : "mslibbyj",
			"count" : 4429
		},
		{
			"_id" : "mrsam",
			"count" : 4237
		}
	],
	"ok" : 1
}
```

###2. Wszyszcy użytkownicy, którzy dodali powyżej 5000 filmów, posortowani od tego, który dodwał najmniej:

```
db.getglue.aggregate(
  { $group: { _id: "$userId", total: { $sum: 1 } } },
  { $match: { total: { $gte: 5000 } } },
  { $sort: { total: 1 } }
)
```
###Wynik:

```
"result" : [
    	{
			"_id" : "tedi31",
			"total" : 5292
		},
		{
			"_id" : "samnaeev",
			"total" : 5357
		},
		{
			"_id" : "adoria",
			"total" : 5449
		},
		{
			"_id" : "s3v3ns",
			"total" : 5774
		},
		{
			"_id" : "endika",
			"total" : 7107
		},
		{
			"_id" : "johnnym2001",
			"total" : 8150
		},
		{
			"_id" : "khairulazmas",
			"total" : 9734
		},
		{
			"_id" : "jesusvarelaacosta",
			"total" : 9924
		}
	],
	"ok" : 1
}
```

***
***

##ElasticSearch

Poleceniem:

```
time < NoSQL/getglue_sample_small.json ./Pobrane/jq --compact-output '{ "index": { "_type": "getglue" } }, .' > getgule_sample.bulk
```

stowrzyłem plik

```
getglue_sample.bulk
```

czas wykonywania:

```
real    5m51.269s
user	5m36.156s
sys     0m11.064s
```

Wykonałem import za pomocą polecenia:

```
curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @getglue_sample.bulk
```

curl nie poradził sobie ze zbyt dużym plikiem, więc podzieliłem go na mniejsze za pomocą polecenia:

```
split -l 300000 elasticsearch/getgule_sample.bulk
```

następnie wykonałem import dla każdego z nich używając poleceń:

```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xaa
```
```
real    4m40.306s
user	0m0.304s
sys     0m1.256s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xab
```
```
real	5m25.771s
user	0m0.292s
sys     0m1.380s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xac
```
```
real	6m6.540s
user	0m0.308s
sys     0m1.352s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xad
```
```
real	5m16.964s
user	0m0.300s
sys     0m1.380s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xae
```
```
real	5m39.331s
user	0m0.340s
sys     0m1.324s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xaf
```
Prawdopodobnie ze względu na problemy z pamięcią komputer miał problem z importem.

![blad zrzut](https://dl.dropboxusercontent.com/u/10832006/zrzut.png)
```
real	23m3.577s
user	0m0.364s
sys 	0m1.404s
```
po restarcie wszystko wróciło do normy

```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xag
```
```
real	6m1.565s
user	0m0.316s
sys 	0m1.240s
```
```
time curl -s -XPOST localhost:9200/getglue/_bulk --data-binary @xah
```
```
real	5m36.167s
user	0m0.284s
sys 	0m1.296s
```

##Agregacje:
###1. 5 użytkowników, którzy dodali najwięcej filmów (movies):

```
{
    "query" : {
        "query_string" : {
          "query" : "modelName:movies"
      }
    },
    "facets" : {
        "user" : {
            "terms" : {
                "field" : "userId",
                "size" : 5
            }
        }
    }
}
```

###Wynik:

```
{

    took: 172
    timed_out: false
    _shards: {
        total: 5
        successful: 5
        failed: 0
    }
    hits: {
        total: 752842
        max_score: 1.4679315
        hits: [
            {
    	//...
                ]
    }
    facets: {
        user: {
            _type: terms
            missing: 0
            total: 752861
            other: 729829
            terms: [
                {
                    term: jesusvarelaacosta
                    count: 6870
                }
                {
                    term: johnnym2001
                    count: 4574
                }
                {
                    term: khairulazmas
                    count: 4482
                }
                {
                    term: s3v3ns
                    count: 4080
                }
                {
                    term: endika
                    count: 3026
                }
            ]
        }
    }

}
```

###2. 10 użytkowników, którzy nie dodali tytułu

```
{
    "query" : {
        "constant_score" : {
          "filter" : {
            "missing": {
              "field":"title"
            }
          }
        }
    },
    "facets" : {
        "notitle" : {
            "terms" : {
                "field" : "userId",
                "size" : 10
            }
        }
    }
}
```

Wynik:

```
{

    took: 62
    timed_out: false
    _shards: {
        total: 5
        successful: 5
        failed: 0
    }
    hits: {
        total: 20
        max_score: 1
        hits: [
            //...
        ]
    }
    facets: {
        notitle: {
            _type: terms
            missing: 0
            total: 20
            other: 8
            terms: [
                {
                    term: jesusvarelaacosta
                    count: 2
                }
                {
                    term: ben_murphy1
                    count: 2
                }
                {
                    term: s3v3ns
                    count: 1
                }
                {
                    term: ragazza_perduta
                    count: 1
                }
                {
                    term: peaceloveandhellokitty
                    count: 1
                }
                {
                    term: michael_kennedy
                    count: 1
                }
                {
                    term: klsmallwood1
                    count: 1
                }
                {
                    term: jonny_danger
                    count: 1
                }
                {
                    term: jmspera
                    count: 1
                }
                {
                    term: hardhouse247
                    count: 1
                }
            ]
        }
    }

}
```
