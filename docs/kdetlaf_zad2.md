### *Detlaf Krzysztof*
#### Zadanie II
#### Tematyka: Społeczność (bilans, płeć, wiek, itp.). 
###### (Oczywiście dane mogą się minimalnie zmienić).
----
###Parametry komputera:

####Intel Core i3-2310M @ 2.10 GHz, 4 GB RAM

Wersja mongo
```
$ mongo --version
MongoDB shell version: 2.4.8
```
----


###Przygotowanie danych:

Do wygenerowania danych użyłem serwisu http://www.json-generator.com/.

Przykład rekordu
-----------
``` json
{
	"_id" : ObjectId("52d16652bfac45ed49407813"),
	"name" : "Chasity Wiggins",
	"gender" : "female",
	"balance" : "9488",
	"liabilities" : "1155",
	"expenses" : "1239"
}
```

# Statystyki (Mongodb)

Statystyki bazy:
```js
> db.society.stats()
```
```json
{
	"ns" : "test.society",
	"count" : 1000000,
	"size" : 124650204,
	"avgObjSize" : 124.650204,
	"storageSize" : 335896576,
	"numExtents" : 14,
	"nindexes" : 1,
	"lastExtentSize" : 92581888,
	"paddingFactor" : 1,
	"systemFlags" : 1,
	"userFlags" : 0,
	"totalIndexSize" : 32458720,
	"indexSizes" : {
		"_id_" : 32458720
	},
	"ok" : 1
}
```

Ilość albumów w kolekcji:
```js
> db.society.count()
1000000
```

###Import danych dla MongoDB:

Niestety mam kilka plików, które trzeba było importować jeden po drugim.
```
mongoimport --collection nazwa_kolekcji --type json --file plik.json --jsonArray
```
--jsonArray powoduje, że mongoimport rozpoznaje konstrukcję jsona
```
mongoimport --collection human --type json --file 1.json --jsonArray
```

Import jednego z 10 plików:

![img](https://raw.github.com/kdetlaf/mongoFiles/master/importToMongo.png)
####Agregacje:


5 kobiet spośrób 1 000 000, które posiadają najwięcej środków na koncie


```
db.society.aggregate(
   [
     { $match : {gender: "female" } },
     { $group : { _id :"$name", balance:{$sum:"$balance"}}},
     { $sort : { balance : -1 } },
     { $limit : 5 }
   ]
 )
```


wynik:



```
{
	"result" : [
		{
			"_id" : "Maryann Carey",
			"balance" : 9488
		},
		{
			"_id" : "Staci Salinas",
			"balance" : 9391
		},
		{
			"_id" : "Nancy Monroe",
			"balance" : 8273
		},
		{
			"_id" : "Edwina Ford",
			"balance" : 7603
		},
		{
			"_id" : "Angeline Hewitt",
			"balance" : 7092
		}
	],
	"ok" : 1
}

```


5 mężczyzn spośród 1 000 000, którzy posiadają najwięcej środków na koncie



```
db.society.aggregate(
   [
     { $match : {gender: "male" } },
     { $group : { _id :"$name", balance:{$sum:"$balance"}}},
     { $sort : { balance : -1 } },
     { $limit : 5 }
   ]
 )
```


wynik:


```
{
	"result" : [
		{
			"_id" : "Donaldson Rowland",
			"balance" : 9391
		},
		{
			"_id" : "Terrell Shaw",
			"balance" : 9285
		},
		{
			"_id" : "Berger Stanton",
			"balance" : 8597
		},
		{
			"_id" : "Weaver Stout",
			"balance" : 7205
		},
		{
			"_id" : "Ferrell Mooney",
			"balance" : 6563
		}
	],
	"ok" : 1
}

```
## ElasticSearch

###Wersja:
```
elasticsearch 0.90.10
```

Export z mongoDB oraz przygotowanie przeplatanego jsona:
```sh
jq --compact-output '{ "index" : { "_type" : "album" } }, .' society.json > societyElastic.json
```

![img](https://raw.github.com/kdetlaf/mongoFiles/master/mongoExport.png)
