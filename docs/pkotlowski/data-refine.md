### *Piotr Kotłowski*

----
Dane pobrałem ze strony http://www.ourairports.com/data/
Następnie oczyściełem je za pomocą narzędza google refine. 
#### Usunąłem niepotrzebne kolumny
#### Wybrałem dane dla lotnisk, usunąłem lądowiska 

Przykładowe 3708 lokalizacji na mapie google (wszystkie lotniska z regularnymi połączeniami):

#MongoDB

## Zadanie 1
### Ilość lotnisk na poszczególnych kontynantach

Zapytanie:
```json
db.test.aggregate(
{ $group :
        { _id : { kontynent : "$continent"},
        ilosc : { $sum : 1 }}
    },
    { $sort : { ilosc : -1 }},
    { $group :
        { _id : "$_id.kontynent",
        ilosc : { $first : "$ilosc" }}
    },
    { $sort : { _id : 1 }}
)

```

Rezultat:
```json
{
	"result" : [
		{
			"_id" : "AF",
			"ilosc" : 2526
		},
		{
			"_id" : "AN",
			"ilosc" : 26
		},
		{
			"_id" : "AS",
			"ilosc" : 3454
		},
		{
			"_id" : "EU",
			"ilosc" : 4989
		},
		{
			"_id" : "NA",
			"ilosc" : 24964
		},
		{
			"_id" : "OC",
			"ilosc" : 2609
		},
		{
			"_id" : "SA",
			"ilosc" : 6866
		}
	],
	"ok" : 1
}
```
![img](http://i.imgur.com/JgJT3LR.jpg)

## Zadanie 2
### Liczba poszczególnych wielkości lotnisk w Polsce, obsługujących regularne połączenia posortowana według ilości malejąco.

```json
db.test.aggregate(
    { $match : { scheduled_service : "yes" , iso_country : "PL"}},

{ $group :
        { _id : { type : "$type"},
        ilosc : { $sum : 1 }}
    },
    { $sort : { ilosc : -1 }},
    { $group :
        { _id : "$_id.type",
        ilosc : { $first : "$ilosc" }}
    },
    { $sort : { _id : 1 }}
)
```
Rezultat:
```json
{{
	"result" : [
		{
			"_id" : "large_airport",
			"ilosc" : 7
		},
		{
			"_id" : "medium_airport",
			"ilosc" : 5
		},
		{
			"_id" : "small_airport",
			"ilosc" : 2
		}
	],
	"ok" : 1
}
```
![img](http://i.imgur.com/fDPNTjH.jpg)

#ElasticSearch
Import danych z pliku
```
curl -s -XPOST   localhost:9200/airports/_bulk --data-binary @data.bulk

```

## Zadanie 1
### Ilość lotnisk na poszczególnych kontynantach

Zapytanie:
```json
curl -X POST "http://localhost:9200/airports/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "continent" : {
            "terms" : {
                "field" : "continent",
                "size" : 100
            }
        }
    }
}'
```

Rezultat:
```json
  "facets" : {
    "continent" : {
      "_type" : "terms",
      "missing" : 0,
      "total" : 41954,
      "other" : 0,
      "terms" : [ {
        "term" : "na",
        "count" : 24964
      }, {
        "term" : "sa",
        "count" : 6866
      }, {
        "term" : "eu",
        "count" : 4989
      }, {
		"term" : "as",
		"count" : 3454
	  }, {
        "term" : "oc",
        "count" : 2609
      }, {
        "term" : "af",
        "count" : 2526
      }, {
		"term" : "an",
		"count" : 26
		}, ]
    }

```
## Zadanie 2
### Liczba poszczególnych wielkości lotnisk w Polsce, obsługujących regularne połączenia posortowana według ilości malejąco.
```json
curl -X POST "http://localhost:9200/airports/_search?pretty=true" -d '
{"query":
{"bool":
{"must":[
	{"text":{
		"airport.iso_country":"PL"}},
	{"text":{
		"airport.scheduled_service":"yes"}}]
}},

    "facets" : {
        "type" : {
            "terms" : {
                "field" : "type",
                "size" : 100
            }
        }
    }
}'
```

Rezultat:
```json
"facets" : {
    "type" : {
      "_type" : "terms",
      "missing" : 0,
      "total" : 14,
      "other" : 0,
      "terms" : [ {
        "term" : "large_airport",
        "count" : 7
      }, {
        "term" : "medium_airport",
        "count" : 5
      }, {
        "term" : "small_airport",
        "count" : 2
      } ]
    }
  }

```