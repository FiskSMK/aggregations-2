#Kamil Karczewski
#Zadanie 2
##Dane 
Wykorzystałem bazę danych udostępnioną przez [GetGlue](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)

#Mongo DB
##Agregacja 1:
####10 najczęściej występujących reżyserów
```
db.imdb.aggregate({$group:{_id: "$director", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 10});
```
```
{
    "result" : [
        {
            "_id" : null,
            "count" : 12235144
        },
        {
            "_id" : "steven spielberg",
            "count" : 108571
        },
        {
            "_id" : "tim burton",
            "count" : 101741
        },
        {
            "_id" : "bill condon",
            "count" : 97835
        },
        {
            "_id" : "gary ross",
            "count" : 82420
        },
        {
            "_id" : "david yates",
            "count" : 77366
        },
        {
            "_id" : "james cameron",
            "count" : 74645
        },
        {
            "_id" : "joss whedon",
            "count" : 72810
        },
        {
            "_id" : "christopher nolan",
            "count" : 68542
        },
        {
            "_id" : "robert zemeckis",
            "count" : 67181
        }
    ],
    "ok" : 1
}
```
Wartość null oznacza, że reżyser nie został podany.
##Agregacja 2
####10 reżyserów mających najwięcej filmów.
```
db.imdb.aggregate( 
    { $match: { "modelName": "movies"} },
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit: 10} 
    );
```
```
  { "_id" : "not available", "count" : 1474 }
    { "_id" : "various directors", "count" : 54 }
    { "_id" : "alfred hitchcock", "count" : 50 }
    { "_id" : "michael curtiz", "count" : 48 }
    { "_id" : "woody allen", "count" : 47 }
    { "_id" : "takashi miike", "count" : 43 }
    { "_id" : "jesus franco", "count" : 43 }
    { "_id" : "ingmar bergman", "count" : 42 }
    { "_id" : "john ford", "count" : 42 }
    { "_id" : "steven spielberg", "count" : 41 }
```

#ElasticSearch
##Agregacja 3
####10 najczęściej występujących imion reżyserów.
```
{
    "query": {
        "match_all": {}
    },
    "facets": {
        "action": {
            "terms": {
                "field" : "director",
                "size" : "10"
            }
        }
    }
}
```
```
{
  "facets": {
    "action": {
      "_type": "terms",
      "missing": 12184882,
      "total": 15626832,
      "other": 13839711,
      "terms": [
        {
          "count": 294079,
          "term": "david"
        },
        {
          "count": 267429,
          "term": "john"
        },
        {
          "count": 195270,
          "term": "james"
        },
        {
          "count": 169772,
          "term": "steven"
        },
        {
          "count": 169529,
          "term": "peter"
        },
        {
          "count": 164195,
          "term": "robert"
        },
        {
          "count": 146425,
          "term": "michael"
        },
        {
          "count": 129172,
          "term": "tim"
        },
        {
          "count": 125787,
          "term": "chris"
        },
        {
          "count": 125463,
          "term": "gary"
        }
      ]
    }
  }
}
```
##Agregacja 4
#### Ile razy wystąpiła dana akcja (liked,disliked,comment, itp.)
```
{
    "query": {
        "match_all": {}
    },
    "facets": {
        "action": {
            "terms": {
                "field" : "action"
            }
        }
    }
}
```
```
{
  "facets": {
    "action": {
      "_type": "terms",
      "missing": 40,
      "total": 19766502,
      "other": 1,
      "terms": [
        {
          "term": "checkin",
          "count": 10902500
        },
        {
          "term": "liked",
          "count": 7662632
        },
        {
          "term": "disliked",
          "count": 468969
        },
        {
          "term": "favorited",
          "count": 287643
        },
        {
          "term": "unwanted",
          "count": 270326
        },
        {
          "term": "saved",
          "count": 101917
        },
        {
          "term": "said",
          "count": 67397
        },
        {
          "term": "looked",
          "count": 2971
        },
        {
          "term": "comment",
          "count": 2131
        },
        {
          "term": "reply",
          "count": 15
        }
      ]
    }
  }
}
```
