### *Zadanie 2*
### 
----

## Opis bazy

Baza danych jest ogólnie dostępna na stronie http://www.majesticseo.com, a do pobrania tutaj: http://downloads.majesticseo.com/majestic_million.csv
Zawiera ona informacje o milionie najpopularniejszych stron internetowych.

## MongoDB

```bash
MongoDB shell version: 2.4.8
```

## Import do bazy

```bash
mongoimport --db majestic --collection majestic --type csv --file majestic_million.csv
```

## Przykładowy rekord:

```bash
{
        "_id" : ObjectId("51e3a38b9354g22a32s3885bb"),
        "GlobalRank" : 1,
        "TldRank" : 1,
        "Domain" : "google.com",
        "TLD" : "com",
        "RefSubNets" : 322088,
        "RefIPs" : 1932179,
        "IDN_Domain" : "google.com",
        "IDN_TLD" : "com",
        "PrevGlobalRan" : 1,
        "PrevTldRank" : 1,
        "PrevRefSubNets" : 322348,
        "PrevRefIPs" : 1936423
}
```

## Ilość rekordów

```bash
   Ilosc rekordów : 1000000
```


## Pierwsza aggregacja

5 najpopularniejszych domen

```bash
{
  "query" : {
    "match_all" : { }
  },
  "facets" : {
    "TLD" : {
      "terms" : {
        "field" : "TLD",
        "size" : 5
      }
    }
  }
}
```

Wynik: 
![](http://kk12.pl/top5domen.jpg)

## Druga agregacja

Sprawdzamy ile stron ma polską domenę

```bash
db.majestic.find({"TLD" : "pl"}).count()
```

Wynik:
16 437
