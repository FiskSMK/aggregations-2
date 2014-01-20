### *Kamil Zdunek*

----

# Zadanie 2

Baza: [Crimes 2001 to present](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-present/ijzp-q8t2).
Dane przedstawiają informacje na temat wystąpień przestępst w Chicago w latach 2001-2013.

##Mongodb

###Import

```
time mongoimport --type csv -c crimes --file Crimes_-_2001_to_present.csv --headerline
```

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/crimes_import.png)
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/crimes_import_end.png)

###Przykładowy rekord

```json
db.crimes.findOne()
{
        "_id" : ObjectId("52bdf40268bf5f7021619ff4"),
        "ID" : 9431558,
        "Case Number" : "HW575406",
        "Date" : "12/18/2013 05:00:00 AM",
        "Block" : "051XX W BELMONT AVE",
        "IUCR" : 820,
        "Primary Type" : "THEFT",
        "Description" : "$500 AND UNDER",
        "Location Description" : "OTHER",
        "Arrest" : "false",
        "Domestic" : "false",
        "Beat" : 2521,
        "District" : 25,
        "Ward" : 30,
        "Community Area" : 19,
        "FBI Code" : 6,
        "X Coordinate" : 1141483,
        "Y Coordinate" : 1920748,
        "Year" : 2013,
        "Updated On" : "12/21/2013 12:40:02 AM",
        "Latitude" : 41.93860639677292,
        "Longitude" : -87.75542882703408,
        "Location" : "(41.93860639677292, -87.75542882703408)"
}
```

##Agregacja 1
###Ilość różnych przestępstw ze względu na popularność występowania

```
db.crimes.aggregate({$group:{_id:"$Primary Type",total:{$sum: 1}}},{$sort:{total:-1}})
```
###Wynik:
```
{
        "result" : [
                {
                        "_id" : "THEFT",
                        "total" : 858621
                },
                {
                        "_id" : "BATTERY",
                        "total" : 757195
                },
                {
                        "_id" : "NARCOTICS",
                        "total" : 489233
                },
                {
                        "_id" : "CRIMINAL DAMAGE",
                        "total" : 488334
                },
                {
                        "_id" : "BURGLARY",
                        "total" : 256974
                },
                {
                        "_id" : "OTHER OFFENSE",
                        "total" : 253709
                },
                {
                        "_id" : "ASSAULT",
                        "total" : 247505
                },
                {
                        "_id" : "MOTOR VEHICLE THEFT",
                        "total" : 197343
                },
                {
                        "_id" : "ROBBERY",
                        "total" : 157420
                },
                {
                        "_id" : "DECEPTIVE PRACTICE",
                        "total" : 137127
                },
                {
                        "_id" : "CRIMINAL TRESPASS",
                        "total" : 124970
                },
                {
                        "_id" : "PROSTITUTION",
                        "total" : 47404
                },
                {
                        "_id" : "WEAPONS VIOLATION",
                        "total" : 40327
                },
                {
                        "_id" : "PUBLIC PEACE VIOLATION",
                        "total" : 31509
                },
                {
                        "_id" : "OFFENSE INVOLVING CHILDREN",
                        "total" : 26414
                },
                {
                        "_id" : "CRIM SEXUAL ASSAULT",
                        "total" : 14769
                },
                {
                        "_id" : "SEX OFFENSE",
                        "total" : 14304
                },
                {
                        "_id" : "GAMBLING",
                        "total" : 10663
                },
                {
                        "_id" : "LIQUOR LAW VIOLATION",
                        "total" : 8859
                },
                {
                        "_id" : "ARSON",
                        "total" : 6452
                },
                {
                        "_id" : "INTERFERE WITH PUBLIC OFFICER",
                        "total" : 5187
                },
                {
                        "_id" : "HOMICIDE",
                        "total" : 4845
                },
                {
                        "_id" : "KIDNAPPING",
                        "total" : 3581
                },
                {
                        "_id" : "INTERFERENCE WITH PUBLIC OFFICER",
                        "total" : 3078
                },
                {
                        "_id" : "INTIMIDATION",
                        "total" : 2476
                },
                {
                        "_id" : "STALKING",
                        "total" : 1984
                },
                {
                        "_id" : "OFFENSES INVOLVING CHILDREN",
                        "total" : 359
                },
                {
                        "_id" : "OBSCENITY",
                        "total" : 218
                },
                {
                        "_id" : "PUBLIC INDECENCY",
                        "total" : 85
                },
                {
                        "_id" : "OTHER NARCOTIC VIOLATION",
                        "total" : 80
                },
                {
                        "_id" : "RITUALISM",
                        "total" : 12
                },
                {
                        "_id" : "NON-CRIMINAL",
                        "total" : 12
                },
                {
                        "_id" : "NON - CRIMINAL",
                        "total" : 2
                },
                {
                        "_id" : "NON-CRIMINAL (SUBJECT SPECIFIED)",
                        "total" : 2
                },
                {
                        "_id" : null,
                        "total" : 1
                }
        ],
        "ok" : 1
}
```
###Wykres:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad2wyk1.png)

##Agregacja 2
###Ilość wystąpień przestępstw pod względem lokalizacji wystąpienia z wyselekcjonowaniem tych, które trafiły się częściej niż 20000 razy

```
db.crimes.aggregate({$group:{_id:"$Location Description",total:{$sum: 1}}},{$sort:{total:-1}},{$match: {total: {$gte : 20000}}})
```
###Wynik:
```
{
        "result" : [
                {
                        "_id" : "STREET",
                        "total" : 1096218
                },
                {
                        "_id" : "RESIDENCE",
                        "total" : 690665
                },
                {
                        "_id" : "SIDEWALK",
                        "total" : 458411
                },
                {
                        "_id" : "APARTMENT",
                        "total" : 441451
                },
                {
                        "_id" : "OTHER",
                        "total" : 150230
                },
                {
                        "_id" : "PARKING LOT/GARAGE(NON.RESID.)",
                        "total" : 117085
                },
                {
                        "_id" : "ALLEY",
                        "total" : 96527
                },
                {
                        "_id" : "SCHOOL, PUBLIC, BUILDING",
                        "total" : 94094
                },
                {
                        "_id" : "RESIDENCE-GARAGE",
                        "total" : 83640
                },
                {
                        "_id" : "VEHICLE NON-COMMERCIAL",
                        "total" : 72397
                },
                {
                        "_id" : "RESIDENCE PORCH/HALLWAY",
                        "total" : 72261
                },
                {
                        "_id" : "SMALL RETAIL STORE",
                        "total" : 69508
                },
                {
                        "_id" : "RESTAURANT",
                        "total" : 59334
                },
                {
                        "_id" : "GROCERY FOOD STORE",
                        "total" : 51124
                },
                {
                        "_id" : "DEPARTMENT STORE",
                        "total" : 47695
                },
                {
                        "_id" : "GAS STATION",
                        "total" : 43968
                },
                {
                        "_id" : "RESIDENTIAL YARD (FRONT/BACK)",
                        "total" : 42046
                },
                {
                        "_id" : "PARK PROPERTY",
                        "total" : 32528
                },
                {
                        "_id" : "CHA PARKING LOT/GROUNDS",
                        "total" : 32167
                },
                {
                        "_id" : "COMMERCIAL / BUSINESS OFFICE",
                        "total" : 29099
                },
                {
                        "_id" : "CTA PLATFORM",
                        "total" : 24556
                },
                {
                        "_id" : "BAR OR TAVERN",
                        "total" : 22011
                }
        ],
        "ok" : 1
}
```
###Wykres:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad2wyk2.png)
----
##Elasticsearch

###Przygotowanie:
Próba pobrania źródła jako pliku json zakończyła się teoretycznym sukcesem po kilku godzinach. Tylko teoretycznym gdyż plik podczas prób dodania indexów
w celu stworzenia przeplatanych jsonów zakańczał się po pewnym czasie błędem:
```
error: cannot allocate memory
Przerwnane
```
Ach te wirtualne maszyny...

Próby konwersji pliku przy użyciu elastic-search-river także zakończone niepowodzeniem.
Sukces odniosło w sumie jakże proste rozwiązanie aczkolwiek zajęło trochę czasu żeby na nie wpaść.

Export JSONów z Mongodb.
```
mongoexport -c crimes -o crimes.json
```
Do wygenerowania "przeplatanych" JSON'ów użyjemy programu jq.
```
time cat crimes.json | jq --compact-output '{ "index": { "_type": "imdb" } }, .' 
  > crimes.bulk
``` 

```
real    26m28.393s
user    16m32.878s
sys     1m17.441s
```

Podział pliku na mniejsze po 100000 linii.
```
split -l 100000 crimes.json
```
###Import plików stworzonych w poprzednim kroku.
```
time for i in x*; do curl -s -XPOST   localhost:9200/data/_bulk --data-binary @$i; done
```
###Wynik:
```
real	13m54.551s
user	0m1.672s
sys	0m8.765s
```
###Liczba zaimportowanych rekordów:
```
curl -XGET 'http://localhost:9200/data/broadband/_count'; echo
```
###Wynik:
```
{"count":4158754,"_shards":{"total":5,"successful":5,"failed":0}}
```
##Agregacja 1
Jak często popełniano przestępstwa w danych latach

```
curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '{
    "query" : {
        "match_all" : {}
    },
    "facets" : {
        "Year" : {
            "statistical" : {
                "field" : "Year"
            }
        }
    }
}'
```
###Wynik:
```
{
  "facets": {
    "Year": {
      "terms": [
        {
          "count": 709628,
          "term": 2010
        },
        {
          "count": 673420,
          "term": 2011
        },
        {
          "count": 641056,
          "term": 2012
        },
        {
          "count": 580173,
          "term": 2009
        },
        {
          "count": 545588,
          "term": 2013
        },
        {
          "count": 431763,
          "term": 2006
        },
        {
          "count": 421335,
          "term": 2007
        },
        {
          "count": 408621,
          "term": 2008
        },
        {
          "count": 47170,
          "term": 2005
        }
      ],
      "other": 0,
      "total": 4458754,
      "missing": 0,
      "_type": "terms"
    }
  },
...
  "_shards": {
    "failed": 0,
    "successful": 5,
    "total": 5
  },
  "timed_out": false,
  "took": 6573
}

```
###Wykres:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad2wyk3.png)

##Agregacja 2
10 najpopularniejszych wystąpień kodów IUCR (Illinois Uniform Crime Reporting), których organy ścigania używają do klasyfikacji incydentów kryminalnych przy podejmowaniu indywidualnych raportów. 
Kody te są również stosowane do łączenia rodzaju przypadków dla celów statystycznych. Departament Policji w Chicago używa obecnie ponad 350 IUCr.

```
curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '{
    "query" : {
        "match_all" : {}
    },
    "facets" : {
        "IUCR" : {
            "terms" : {
                "field" : "IUCR",
                "size" : 10
            }
        }
    }
}'
```
###Wynik:
```
{
  "facets": {
    "IUCR": {
      "terms": [
        {
          "count": 401380,
          "term": 486
        },
        {
          "count": 330867,
          "term": 820
        },
        {
          "count": 289506,
          "term": 460
        },
        {
          "count": 249267,
          "term": 1811
        },
        {
          "count": 243360,
          "term": 1320
        },
        {
          "count": 238245,
          "term": 1310
        },
        {
          "count": 237172,
          "term": 810
        },
        {
          "count": 207377,
          "term": 610
        },
        {
          "count": 188006,
          "term": 560
        },
        {
          "count": 106544,
          "term": 890
        }
      ],
      "other": 1967030,
      "total": 4458754,
      "missing": 0,
      "_type": "terms"
    }
  },
...
  "_shards": {
    "failed": 0,
    "successful": 5,
    "total": 5
  },
  "timed_out": false,
  "took": 3172
}

```
###Wykres (po przyporządkowaniu nazw do kodów):
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/zad2wyk4.png)
