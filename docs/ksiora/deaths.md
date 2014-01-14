***Zadanie 2***

#Dane

Dane pochodzą ze strony [United Nations Data Retrieval System](http://data.un.org). Konretnie z tego [linku](http://data.un.org/Data.aspx?d=POP&f=tableCode%3a105). Zawierają szczególowe dane na temat zgonów na całym świecie z lat 1995-2010. Źrodłem jest United Nations Statistics Division. Z uwagi na ograniczenia pobierania jednorazowo tylko 50 000 rekordów, wybrałem 23 europejskie kraje i pobierałem dane oddzielnie wybierając interesujące mnie państwa i kolumny. Na koniec skopiowałem dane z poszczególnych plików do jednego, finalnego pliku csv.

Import wykonałem poleceniem:

```sh
mongoimport -c death --type csv --headerline --file Death.csv
```
Wynik

```sh
connected to: 127.0.0.1
Sun Dec 29 22:21:05.002     Progress: 3760038/77844325  4%
Sun Dec 29 22:21:05.004       52700 17566/second
...
Sun Dec 29 22:21:44.006     Progress: 11429777869/11454208342 99%
Sun Dec 29 22:21:44.007       19788300  16449/second
Sun Dec 29 22:21:44.582 check 9 1036956
Sun Dec 29 22:21:44.586 imported 1036955 objects
```

W ciągu 39 sekund zaimportowanych zostało 1 036 955 rekordów.

![img](http://i40.tinypic.com/2zzj2c8.gif)

#Agregacja1

Wyszukujemy 10 najczęstych przyczyn zgonów w Polsce wśród dzieci w wieku 10 - 14 lat.

```js
var coll = db.death;

var result = coll.aggregate(
	{$match: {Country: "Poland"}},
	{$match: {Age: "10 - 14"}},
	{$group: {_id: "$Cause_of_death", count:{$sum: "$Value"} } },
	{$sort: {count:-1} },
	{$limit:11}
);

printjson(result);
```

Rezultat jest następujący (ignorujemy wynik dla "All causes"):

```json
MongoDB shell version: 2.4.8
connecting to: test
{
	"result" : [
		{
			"_id" : "All causes",
			"count" : 7125
		},
		{
			"_id" : "External causes",
			"count" : 3429
		},
		{
			"_id" : "Accidents",
			"count" : 2631
		},
		{
			"_id" : "Transport accidents",
			"count" : 1503
		},
		{
			"_id" : "Neoplasms",
			"count" : 1227
		},
		{
			"_id" : "Malignant neoplasms",
			"count" : 1181
		},
		{
			"_id" : "Diseases of the nervous system",
			"count" : 694
		},
		{
			"_id" : "Accidental drowning and submersion",
			"count" : 561
		},
		{
			"_id" : "Intentional self-harm",
			"count" : 529
		},
		{
			"_id" : "Malignant neoplasm of lymphoid, haematopoietic and related tissue",
			"count" : 488
		},
		{
			"_id" : "Congenital malformations, deformations and chromosomal abnormalities ",
			"count" : 383
		}
	],
	"ok" : 1
}
```

Wykres:


![img](http://i40.tinypic.com/25555x2.gif)


#Agregacja2

Wyszukujemy 5 państw, w których zapalenie płuc odebrało życie największej liczbie osób:

```js
var coll = db.death;

var result = coll.aggregate(
	{$match: {Cause_of_death: "Pneumonia"}},
	{$group: {_id: "$Country", count:{$sum: "$Value"} } },
	{$sort: {count:-1} },
	{$limit:5}
);

printjson(result);
```

Wynik:

```json
MongoDB shell version: 2.4.8
connecting to: test
{
	"result" : [
		{
			"_id" : "United Kingdom of Great Britain and Northern Ireland",
			"count" : 1308340
		},
		{
			"_id" : "Germany",
			"count" : 595468
		},
		{
			"_id" : "France",
			"count" : 358060
		},
		{
			"_id" : "Spain",
			"count" : 238688
		},
		{
			"_id" : "Poland",
			"count" : 224466
		}
	],
	"ok" : 1
}
```

Wykres:

![img](http://i43.tinypic.com/9sxb4i.gif)


###ElasticSearch

#Dane

Plik dane.csv przerobiłem na plik json tym [skryptem](https://gist.github.com/enriclluelles/1423950). Niestety skrypt rodzielał jsony znakiem "," i przez to polecenie -

```sh
< death.json jq --compact-output '{ "index": { "_type": "els" } }, .' > death.bulk
```

w rezultacie dawało plik z jedną linijką i nie można było go zaimportować do bazy. Aby tego uniknąć poleceniem -

```sh
time sed -i 's/},/}/g' death.json
```

usunąłem wszystkie przecinki oddzielające jsony. Mając poprawny plik death.bulk spróbowałem zaimportować go do bazy. Niestety zakończyło się to niepowodzeniem. Rozdzieliłem plik na pliki po 200000 linii:

```sh
split -l 200000 death.bulk 
```

Następnie w pętli zaimportowałem dane: 

```sh
time for i in x*; do curl -s -XPOST   localhost:9200/death/_bulk --data-binary @$i; done
```

Sprawdzenie ile danych zostało zaimportowane 

![img](http://i40.tinypic.com/2daftdv.png)


#Agregacja3

Ilość zgonów w wyniku Malarii.

```json
{
  "query": {
	"query_string": {
	  "query": "Cause_of_death: Malaria"
	}
  },
  "facets": {
	"Malaria": {
	  "statistical": {
		"field": "Value"
	  }
	}
  }
}
```
Wynik:

```json
{
	facets: {
		Malaria: {
			_type: statistical
			count: 16042
			total: 1999
			min: 0
			max: 20
			mean: 0.1246103977060217
			sum_of_squares: 8947
			variance: 0.542195724659373
			std_deviation: 0.7363394086013413
		}
	}
}
```

![img](http://i39.tinypic.com/2zirezc.jpg)

Ilość zgonów w wyniku Malarii wynosi 1999.

#Agregacja4

Ilość zgonów dzieci w wieku 2 lat.

```json
{
  "query": {
    "query_string": {
      "query": "Age: 2"
    }
  },
  "facets": {
    "2lata": {
      "statistical": {
        "field": "Value"
      }
    }
  }
}
```

Wynik:

```json
{
	facets: {
		2lata: {
			_type: statistical
			count: 39710
			total: 67523
			min: 0
			max: 328
			mean: 1.7004029211785445
			sum_of_squares: 3047869
			variance: 73.86181550121533
			std_deviation: 8.594289703123541
		}
	}
}
```
![img](http://i40.tinypic.com/sengnt.gif)

Smierć w wieku 2 lat poniosło 67523 dzieci.