#Oskar Plichta
#Zadanie 2 - MongoDB
##Dane

[GetGlue and Timestamped Event Data](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) (ok. `11 GB`, `19 831 300` json-ów, próbka 100 jsonów [getglue101](https://github.com/nosql/aggregations-2/blob/master/data/wbzyl/getglue101.json)). Są to dane z [IMDB](http://www.imdb.com/) z lat 2007–2012, tylko filmy i przedstawienia TV. 

Przykładowy dokument `json`:

```json
{
	"_id" : ObjectId("52b81289d4f850c63820fee5"),
	"comment" : "",
	"hideVisits" : "false",
	"modelName" : "tv_shows",
	"displayName" : "",
	"title" : "Criminal Minds",
	"timestamp" : "2008-08-01T06:58:14Z",
	"image" : "http://cdn-1.nflximg.com/us/boxshots/large/70056671.jpg",
	"userId" : "areilly",
	"private" : "false",
	"source" : "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
	"version" : "2",
	"link" : "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
	"lastModified" : "2011-12-16T19:41:19Z",
	"action" : "Liked",
	"lctitle" : "criminal minds",
	"objectKey" : "tv_shows/criminal_minds",
	"visitCount" : "1"
}
```

##Import

Po ściągnięciu pliku rozkapowujemy go komendą:

```sh
tar -xf getglue_sample.tar.gz
```
Mierzymy czas import'u poleceniem `time`. 

```sh
time mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```
###Wynik
```sh
Mon Dec 23 11:59:59.004 		Progress: 11357945834/11454208342	99%
Mon Dec 23 11:59:59.004 			19662600	14873/second
Mon Dec 23 12:00:02.021 		Progress: 11396729995/11454208342	99%
Mon Dec 23 12:00:02.021 			19730200	14890/second
Mon Dec 23 12:00:05.003 		Progress: 11425370624/11454208342	99%
Mon Dec 23 12:00:05.004 			19780200	14894/second
Mon Dec 23 12:00:07.958 check 9 19831300
Mon Dec 23 12:00:08.179 imported 19831300 objects
```

###Czasy
```sh
real	22m10.912s
user	6m43.097s
sys	0m45.335s
```

Import był przeprowadzany na dysku SSD ale na partycji Windowsowej w systemie plików NTFS przez co odbył się wolniej niz na tradycyjnych dyskach HDD sformatowanych w systemie plików ext4. Dokładną różnice w czasie można zobaczyć na przykładzie poprzedniego zadania gdzie testowałem oba przypadki.


###Sprawdzenie
```js
MongoDB shell version: 2.4.8
connecting to: test
> show dbs
imdb	17.9453125GB
local	0.078125GB
train	11.9482421875GB
> use imdb
switched to db imdb
> db.imdb.count()
19831300
> 
```

##Aggregacje

> Przykładowe aggregacje i zliczania: ilu jest różnych użytkowników w danych? jakie jest 10 najpopularniejszych filmów ? ile jest różnych akcji?

###Aggregacja 1

###Ile jest różnych akcji?

####Kod aggregacji

Kod skryptu: [tutaj](/scripts/oplichta/2-mongo/aggregation1.js).

####Wynik

```sh
MongoDB shell version: 2.4.8
connecting to: imdb
Łącznie akcji: 12
```

```json
{
	"result" : [
		{
			"_id" : "Checkin",			"ilosc" : 10958039
		},
		{
			"_id" : "Liked",			"ilosc" : 7664733
		},
		{
			"_id" : "Disliked",			"ilosc" : 469093
		},
		{
			"_id" : "Favorited",			"ilosc" : 288096MongoDB shell version: 2.4.8
connecting to: imdb
Łącznie akcji: 12

		},
		{
			"_id" : "Unwanted",			"ilosc" : 270330
		},
		{
			"_id" : "Saved",			"ilosc" : 101944
		},
		{
			"_id" : "Said",			"ilosc" : 73887
		},
		{
			"_id" : "Looked",			"ilosc" : 2972
		},
		{
			"_id" : "Comment",			"ilosc" : 2150
		},
		{
			"_id" : null,			"ilosc" : 40
		},
		{
			"_id" : "Reply",			"ilosc" : 15
		},
		{
			"_id" : "LikedComment",			"ilosc" : 1
		}
	],
	"ok" : 1
}

```

####Czasy

```sh
real	0m53.125s
user	0m0.040s
sys	0m0.024s
```
###Aggregacja 2

###Jakie jest 20 najpopularniejszych filmów ?

####Kod aggregacji


Kod skryptu: [tutaj](../../scripts/oplichta/2-mongo/aggregation2.js).

####Wynik

```sh
MongoDB shell version: 2.4.8
connecting to: imdb
```

```json
{
	"result" : [
		{
			"_id" : "The Twilight Saga: Breaking Dawn Part 1",
			"ilosc" : 87521
		},
		{
			"_id" : "The Hunger Games",
			"ilosc" : 79340
		},
		{
			"_id" : "Marvel's The Avengers",
			"ilosc" : 64356
		},
		{
			"_id" : "Harry Potter and the Deathly Hallows: Part II",
			"ilosc" : 33680
		},
		{
			"_id" : "The Muppets",
			"ilosc" : 29002
		},
		{
			"_id" : "Captain America: The First Avenger",
			"ilosc" : 28406
		},
		{
			"_id" : "Avatar",
			"ilosc" : 23238
		},
		{
			"_id" : "Thor",
			"ilosc" : 23207
		},
		{
			"_id" : "The Hangover",
			"ilosc" : 22709
		},
		{
			"_id" : "Titanic",
			"ilosc" : 20791
		},
		{
			"_id" : "The Smurfs",
			"ilosc" : 19707
		},
		{
			"_id" : "Monsters, Inc.",
			"ilosc" : 19491
		},
		{
			"_id" : "Dark Shadows",
			"ilosc" : 19322
		},
		{
			"_id" : "Beauty and the Beast",
			"ilosc" : 19159
		},
		{
			"_id" : "Iron Man",
			"ilosc" : 19038
		},
		{
			"_id" : "Dr. Seuss' The Lorax",
			"ilosc" : 18662
		},
		{
			"_id" : "Immortals",
			"ilosc" : 18049
		},
		{
			"_id" : "X-Men: First Class",
			"ilosc" : 18001
		},
		{
			"_id" : "Snow White and the Huntsman",
			"ilosc" : 17919
		},
		{
			"_id" : "Puss In Boots",
			"ilosc" : 17918
		}
	],
	"ok" : 1
}

```

####Czasy

```sh
real	0m52.670s
user	0m0.036s
sys	0m0.024s
```

#Zadanie 2 - Elasticsearch

##Dane

[GetGlue and Timestamped Event Data](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) (ok. `11 GB`, `19 831 300` json-ów, próbka 100 jsonów [getglue101](https://github.com/nosql/aggregations-2/blob/master/data/wbzyl/getglue101.json)). Są to dane z [IMDB](http://www.imdb.com/) z lat 2007–2012, tylko filmy i przedstawienia TV. 

Przykładowy dokument `json`:

```json
{
	"_id" : ObjectId("52b81289d4f850c63820fee5"),
	"comment" : "",
	"hideVisits" : "false",
	"modelName" : "tv_shows",
	"displayName" : "",
	"title" : "Criminal Minds",
	"timestamp" : "2008-08-01T06:58:14Z",
	"image" : "http://cdn-1.nflximg.com/us/boxshots/large/70056671.jpg",
	"userId" : "areilly",
	"private" : "false",
	"source" : "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
	"version" : "2",
	"link" : "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
	"lastModified" : "2011-12-16T19:41:19Z",
	"action" : "Liked",
	"lctitle" : "criminal minds",
	"objectKey" : "tv_shows/criminal_minds",
	"visitCount" : "1"
}
```
##Przygotowanie danych do importu

Do masowego importu danych do Elasticsearch'a użyjemy [`Bulk API`](http://www.elasticsearch.org/guide/en/elasticsearch/reference/current/docs-bulk.html).  

Bulk API wymaga "przeplatanych" JSON'ów o następującej strukturze:

```js
{ "index": { "_type": "type name" } } //nazwa typu, do którego chcemy dodać dokument
{ "field": "content" ... } //dokument
```

Do wygenerowania "przeplatanych" JSON'ów użyjemy programu [`jq`](http://stedolan.github.io/jq/).

```sh
time cat getglue_sample.json | jq --compact-output '{ "index": { "_type": "imdb" } }, .' 
  > getglue_sample.bulk
```

####Wynik

Otrzymujemy "przeplatane" JSON'y:

```json
{
  "index": {
    "_type": "imdb"
  }
}
{
  "objectKey": "tv_shows/criminal_minds",
  "hideVisits": "false",
  "modelName": "tv_shows",
  "displayName": "",
  "title": "Criminal Minds",
  "timestamp": "2008-08-01T06:58:14Z",
  "image": "http://cdn-1.nflximg.com/us/boxshots/large/70056671.jpg",
  "userId": "areilly",
  "visitCount": "1",
  "comment": "",
  "private": "false",
  "source": "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
  "version": "2",
  "link": "http://www.netflix.com/Movie/Criminal_Minds_Season_1/70056671",
  "lastModified": "2011-12-16T19:41:19Z",
  "action": "Liked",
  "lctitle": "criminal minds"
}
```

Plik `getglue_sample.bulk` zawiera łącznie `39 662 600` dokumentów JSON.

####Czasy

```sh
real	67m8.139s
user	40m12.683s
sys	5m31.685s
```

W ciągu `30m34.117s` wygenerowało się `39 662 600` dokumentów JSON. Co średnio daje `~21 626` wygenerowanych dokumentów JSON na sekundę.

##Import

Próba wykonania importu całego pliku `getglue_sample.bulk` (`39 662 600` JSON'ów, `11,3 GB`) konczy się niepowodzeniem.

```sh
curl -s -XPOST localhost:9200/data/_bulk --data-binary @getglue_sample.bulk
```


Trzeba podzielić plik na części po `200 000` linii czyli `100 000` dokumnetów do dodania. Robimy to komendą:

```sh
split -l 200000 getglue_sample.bulk
```

A następnie dokonujemy importu w pętli:

```sh
time for i in x*; do curl -s -XPOST   localhost:9200/data/_bulk --data-binary @$i; done
```

Nie importowałem całej bazy a jedynie jej część ponieważ nie miałem tyle miejsca na dysku SSD.

####Wynik

Sprawdzamy ile obiektów zostało zapisanych w bazie.

```sh
curl -XGET 'http://localhost:9200/data/imdb/_count' ; echo
```

```json
{"count":5187037,"_shards":{"total":1,"successful":1,"failed":0}}
```

Zaimportowało się `5187037`.

####Czasy

```sh
real	33m41.586s
user	0m3.784s
sys	0m15.909s
```

W czasie `33m41.586s` zaimportowało `5187037` obiektów. Co daje średnio `~2566` insertów na sekundę.

## Zapytania 

Zapytania robiłem przy użyciu pluginu Elasticsearch-Head, zakładka Any Request.

```sh
http://localhost:9200/_plugin/head/
```

##Zapytanie 1
### Z jakich 10 najczęstszych applikacji logują  się użytkownicy? 


```json
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "userId" : {
            "terms" : {
                "field" : "app",
                "size" : 10
            }
        }
    }
}
```
####Wynik
```json
facets: {
userId: {
_type: terms
missing: 7207
total: 5186736
other: 497164
terms: [
{
term: getglue
count: 3199803
}
{
term: iphone
count: 367809
}
{
term: android
count: 304123
}
{
term: mobilesite
count: 182067
}
{
term: iphone_2.4.3
count: 141159
}
{
term: android_2.3.2
count: 137882
}
{
term: ipad_2.3.2
count: 101396
}
{
term: iphone_2.3.2
count: 98467
}
{
term: blackberry_1.0
count: 82196
}
{
term: iphone_2.4.4
count: 74670
}
]
}
}
```

Pełen wynik [tutaj](../../scripts/oplichta/2-es/wynik1).


## Zapytanie 2
### Z jakich 10 najczęstszych źródeł logują sie użytkownicy?
```json
{
  "query": {
    "match_all": {}
  },
  "facets": {
    "userId": {
      "terms": {
        "field": "source",
        "size": 10
      }
    }
  }
}
```
####Wynik:
```json
facets: {
userId: {
_type: terms
missing: 172
total: 17890817
other: 5824180
terms: [
{
term: http
count: 2877010
}
{
term: getglue.com
count: 2657945
}
{
term: tv_shows
count: 1403667
}
{
term: movies
count: 1305781
}
{
term: iphone
count: 966748
}
{
term: quickrate
count: 703439
}
{
term: glue
count: 649034
}
{
term: lists
count: 637844
}
{
term: suggestions
count: 473241
}
{
term: android
count: 391928
}
]
}
}
```

Pełen wynik [tutaj](../../scripts/oplichta/2-es/wynik2).