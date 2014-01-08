### *Głosowanie - Damian Matulewski*
###
----

## Zadanie 2
    * [Opis bazy](#opis-bazy)
    * [MongoDB](#mongodb)
        * [Import bazy do mongo](#import-bazy-do-mongo)
        * [Pierwsza agregacja](#pierwsza-aggregacja)
        * [Druga agregacja](#druga-aggregacja)
    * [Elasticsearch](#elasticsearch)
        * [Import elasticsearch](#import-elasticsearch)
        * [Pierwsza agregacja](#pierwsza-aggregacja-elasticsearch)
        * [Druga agregacja](#druga-aggregacja-elasticsearch)

   

## Opis bazy

Baza została pobrana w formacie CSV i została oczyszczona za pomocą google refine.
Baze danych pobralem ze strony: http://openstates.org/downloads/ dla miasta NY w USA.

## MongoDB

```bash
MongoDB shell version: 2.4.7
```

## Import bazy do mongo

```bash
mongoimport --db vote --collection votes --type csv --file C:/votes.csv
```
## Liczba i przykład
```bash
> db.vote.count()
     
    Ilosc rekordów : 886182

> db.vote.findOne()
{
        "_id" : ObjectId("52b349e1093c8062d690c84d"),
        "vote_id" : "NYV00004655",
        "leg_id" : "NYL000025",
        "name" : "Johnson",
        "vote" : "yes"
}
```

## Pierwsza aggregacja:
Wyświetlenie ile zostało oddanych pozytywnych, negatywnych głosów bądź ile osób powstrzymało sie od niego.

```bash
> db.vote.aggregate({ $group: { _id: "$vote", sumka: {$sum: 1}}})
{
        "result" : [
                {
                        "_id" : "other",
                        "sumka" : 34590
                },
                {
                        "_id" : "no",
                        "sumka" : 41807
                },
                {
                        "_id" : "yes",
                        "sumka" : 809785
                }
        ],
        "ok" : 1
}


```

Wykres:
![Diagram](../images/dmatulewski/diagram1.png)

## Druga aggregacja:
Top 5 osób które oddały najwięcej głosów.
   
```bash
> db.vote.aggregate( [ { $match : { vote : "yes"}}, {$group: { _id: "$name", suma : {$sum: 1 }}}, { $limit: 5 }, { $sort : { suma : -1, posts: 1 } }])
{
        "result" : [
                {
                        "_id" : "Duprey",
                        "suma" : 2877
                },
                {
                        "_id" : "Meng",
                        "suma" : 1222
                },
                {
                        "_id" : "Fahy",
                        "suma" : 1074
                },
                {
                        "_id" : "Santaba",
                        "suma" : 1046
                },
                {
                        "_id" : "DiPietr",
                        "suma" : 762
                }
        ],
        "ok" : 1
}
```


Wykres:
![Diagram2](../images/dmatulewski/diagram2.png)

## Elasticsearch

Elasticsearch version : 0.90.9

### Import elasticsearch
Wrzuciłem bazę w częściach, ze względu na duży rozmiar danych.
 
```bash
curl localhost:9200/vote/_bulk --data-binary @vote1.bulk
```
## Pierwsza aggregacja elasticsearch:

Wyświetlenie ile zostało oddanych pozytywnych, negatywnych głosów bądź ile osób powstrzymało się od niego:

```bash   

 
{
	"query":{
		"match_all":{}
		},
	"facets":
		{
		"tags":
			{"terms":
				{"field":"vote"}
		}
	}
}
		
		



```
Wykres:
![Diagram](../images/dmatulewski/diagram1.png)

## Druga aggregacja elasticsearch:

Top 5 osób które oddały najwięcej głosów.

```bash

{
  "query" : {
    "query_string" : {
       "query" : "yes"
     }
  },
  "filter" : {
    "term" : {
      "tag" : "vote"
     }
  },
  "facets" : {
    "format" : {
      "terms" : {
        "field" : "name"
      }
    }
  }
}




```
Wykres:
![Diagram2](../images/dmatulewski/diagram2.png)
