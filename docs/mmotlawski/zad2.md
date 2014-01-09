#Zadanie 2

##Dane

[GetGlue and Timestamped Event Data](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) (ok. `11 GB`, `19 831 300` json-ów, próbka 100 jsonów [getglue101](https://github.com/nosql/aggregations-2/blob/master/data/wbzyl/getglue101.json)). Są to dane z [IMDB](http://www.imdb.com/) z lat 2007–2012, tylko filmy i przedstawienia TV. 

Przykładowy dokument `json`:

```json
{
  "_id": ObjectId("5276918832cf3c2b84540440"),
  "comment": "",
  "modelName": "movies",
  "displayName": "",
  "title": "The Dark Knight",
  "timestamp": "2008-10-28T16:47:31Z",
  "image": "http://ia.media-imdb.com/images/...@@._V1._SX94_SY140_.jpg",
  "userId": "sippey",
  "private": "false",
  "director": "Christopher Nolan",
  "source": "http://www.imdb.com/title/tt0468569/",
  "version": "1",
  "link": "http://www.imdb.com/title/tt0468569/",
  "lastModified": "2011-12-16T19:39:33Z",
  "action": "Liked",
  "lctitle": "the dark knight",
  "objectKey": "movies/dark_knight/christopher_nolan"
}
```
#MongoDB

##Import

Po ściągnięciu rozpakowujemy:
```sh
tar -xvf getglue_sample.tar.gz
```

Od razu nadaje się do importu. Polecenie `time` mierzymy ile czasu zajął import.

```sh
time mongoimport -d movedb -c movedb --type json --file getglue_sample.json
```

###Czas

```sh

real  57m58.013s

```


##Agregacje

###Agregacja 1

#Elasticsearch

##Import

Próba zaimportowania całego pliku do bazy zakończyła się otrzymaniem komunikatu `out of memory`.

Aby zaimportować plik do bazy podzielimy go na mniejsze części.

```sh
split -l 200000 getglue_sample.bulk
```
A nastepnie importujemy pliki w pętli:

```sh
for i in x*; do curl -s -XPOST localhost:9200/data/_bulk --data-binary @$i > /dev/null; echo $i; done
```
####Wynik

Sprawdzamy ile obiektów zostało zapisanych w bazie.

```sh
curl -XGET 'http://localhost:9200/data/imdb/_count' ; echo
```

```json
{"count":19766542,"_shards":{"total":1,"successful":1,"failed":0}}
```

Zaimportowało się `19 766 542`. `64 758` obiektów zostało odrzuconych z powodu złego formatu daty.

###Agregacja 1

Agregacja miała policzyc ile razy wystepuje "tv_shows"

####Kod agregacji

```json
{
    "query": {
        "match_all": {}
    },
    "facets": {
        "modelName": {
            "terms": {
                "field" : "modelName",
                "size" : "10"
            },
        "facet_filter" : {
        "term" : { "modelName" : "tv_shows"}

}
        }
    }
}
```

####Wynik
```json
{
  "facets": {
    "modelName": {
      "terms": [
        {
          "count": 12208046,
          "term": "tv_shows"
        }
      ],
      "other": 0,
      "total": 12208046,
      "missing": 0,
      "_type": "terms"
    }
  }
```

###Agregacja 2

Agregacja wylicza 10 naczęsciej wystepujących imion reżyserów.

####Kod agregacji

```json
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

####Wynik
```json
{
  "facets": {
    "action": {
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
      ],
      "other": 13839711,
      "total": 15626832,
      "missing": 12184882,
      "_type": "terms"
    }
  }
```
