### *Michał Wąsowicz*

----

## Dane

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

## Import:

```sh
mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```

![Import wraz ze sprawdzeniem czasu](../images/mwasowicz/Zad2_Import.jpg "Import wraz ze sprawdzenie czasu")

Po imporcie możemy sprawdzić, ile rekordów zostało zaimportowanych do bazy:
    
```sh
db.imdb.count()
19831300
```


## Agregacje
### Agregacja 1

Agregacja odpowiada na pytanie, jakie jest 10 najpopularniejszych filmów i przedstawień TV?

#### Kod agregacji

``` js
db.imdb.aggregate(
    { $match: {"modelName": "movies" || "tv_shows"  } },
    { $group: {_id: "$title", count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit : 10}
    );
```

##### Wynik
```json
{
  "result" : [
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
  ],
  "ok" : 1
}
```
#### Wykres

![Agregacja 1](../images/mwasowicz/Agregacja1.jpg "Agregacja 1")


### Agregacja 2

Agragacja ma policzyć i zwrócić 10 reżyserów, którzy mają na swoim koncie najwiekszą liczbę filmów.

#### Kod agregacji

``` js
db.imdb.aggregate(
    { $match: {"modelName": "movies" || "tv_shows"  } },
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit : 10}
    );
```

##### Wynik

```json
{
  "result" : [
    { "_id" : "not available",      "count" : 1474  },
    { "_id" : "various directors",  "count" : 54    },
    { "_id" : "alfred hitchcock",   "count" : 50    },
    { "_id" : "michael curtiz",     "count" : 48    },
    { "_id" : "woody allen",        "count" : 47    },
    { "_id" : "takashi miike",      "count" : 43    },
    { "_id" : "jesus franco",       "count" : 43    },
    { "_id" : "ingmar bergman",     "count" : 42    },
    { "_id" : "john ford",          "count" : 42    },
    { "_id" : "steven spielberg",   "count" : 41    }
  ],
  "ok" : 1
}
```



#### Wykres
W wyniku agregacji uwzględnione zostały wartości "not available" oraz "various directors", które z oczywistych względów pominąłem na wykresie.

![Agregacja 2](../images/mwasowicz/Agregacja2.jpg "Agregacja 2")

### Agregacja 3

#### Kod agregacji

##### Wynik

#### Wykres




### Agregacja 4

#### Kod agregacji

##### Wynik

#### Wykres