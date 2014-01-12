## MongoDB version

```bash
MongoDB version: 2.5.3
```

## ElasticSearch

```bash
elasticsearch-0.90.9
```

# Zadanie 2

## Menu

- [Dane](#dane)
- [Mongodb](#mongodb)
    - [Import danych](#import-danych)
    - [Czas i ilosc zaimportowanych danych](#czas-i-ilosc-zaimportowanych-danych)
    - [MongoDB: Aggregacje](#mongodb-aggregacje)
        - [Aggregacja 1](#aggregacja-1)
		- [Aggregacja 2](#aggregacja-2)
- [ElasticSearch: Wyszukiwanie fasetowe](#elasticsearch-wyszukiwanie-fasetowe)
	- [Przygotowywanie danych do importu](#przygotowywanie-danych-do-importu)
	- [Import danych do ES](#import-danych-do-es)
#Dane

Do rozwiązania zadania wykorzystałem baze danych udostępnioną przez przez GetGlue umieszczoną na stronie dr Włodzimierza Bzyla

#Mongodb

## Import danych
    
```bash
$ mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```
    
## Czas i ilosc zaimportowanych danych
    
![Czas importu do bazy](../../images/rtomczak/zad2_import_mongo.png "Czas importu do bazy")
    
Od razu sprawdzamy ile json'ow zaimportowalimy do bazy 
    
```bash
> db.imdb.count()
19831300
```

## MongoDB: Aggregacje

#### Aggregacja 1

___ Aggregacja wyszukuje 10 najpopularniejszych filmow___

##### Kod aggregacji

```json
	> db.imdb.aggregate(
	{ $match: {"modelName": "movies"}}, 
	{ $group: {_id: "$title", count: {$sum: 1}} },
	{ $sort: {count: -1} },
	{ $limit : 10}
	);
```

##### Wynik
```json
	{ "_id" : "The Twilight Saga: Breaking Dawn Part 1",       "count" : 87521 },
    { "_id" : "The Hunger Games",                              "count" : 79340 },
    { "_id" : "Marvel's The Avengers",                         "count" : 64356 },
    { "_id" : "Harry Potter and the Deathly Hallows: Part II", "count" : 33680 },
    { "_id" : "The Muppets",                                   "count" : 29002 },
    { "_id" : "Captain America: The First Avenger",            "count" : 28406 },
    { "_id" : "Avatar",                                        "count" : 23238 },
    { "_id" : "Thor",                                          "count" : 23207 },
    { "_id" : "The Hangover",                                  "count" : 22709 },
    { "_id" : "Titanic",                                       "count" : 20791 }
```

Wizualizacja danych pod linkiem : [Wykres](http://roberttomczak.github.io/charts/chart1.html)

#### Aggregacja 2

___ Aggregacja wyszukuje 10 rezyserow mający najwiecej filmow___

##### Kod aggregacji

```json
	> db.imdb.aggregate( 
	{ $match: { "modelName": "movies"} },
	{ $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
	{ $group: {_id: "$_id.dir" , count: {$sum: 1}} },
	{ $sort: {count: -1} },
	{ $limit: 10} 
	);
```

##### Wynik
```json
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

Wizualizacja danych pod linkiem : [Wykres](http://roberttomczak.github.io/charts/chart2.html)

***

## ElasticSearch: Wyszukiwanie fasetowe

#### Przygotowywanie danych do importu
	
Do masowego importu danych do Elasticsearch'a użyjemy [Bulk API](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/docs-bulk.html).  

Bulk API wymaga "przeplatanych" JSON'ów o następującej strukturze:

```js
{ "index": { "_type": "type name" } }
{ "field": "content" ... }
```
	
Aby uzyskać pozadana strukture użyje programu [jq](http://stedolan.github.io/jq/).
	
```sh	
time cat getglue_sample.json | jq --compact-output '{ "index": { "_type": "imdb" } }, .' > getglue_sample.bulk
```
	
#### Czas

```sh
	real	30m49.988s
	user	26m54.761s
	sys		1m9.704s
```

#### Import danych do ES
	
Import calego pliku jest niemozliwe z powodu bledu `out of memory`

Aby zaimportować plik do bazy uzywamy skryptu w pythonie