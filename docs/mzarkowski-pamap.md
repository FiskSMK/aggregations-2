# Physical Activity Monitoring #

###Mateusz Żarkowski###

# Dane #

Do zadania wykorzystałem bazę PAMAP2 Physical Activity Monitoring Dataset ze strony http://archive.ics.uci.edu/ml/datasets/PAMAP2+Physical+Activity+Monitoring 

Baza zawiera dane z 18 różnych aktywności fizycznych (takich jak spacer, jazda na rowerze, gra w piłkę nożną itd.), wykonywanych przez 9 ochotników noszących 3 urządzenia pomiarowe i pulsometr. 

Orginalna baza zawiera ok. 3 milionów rekordów, jednak około połowa jest bezwartościowych.

Przykładowy rekord:
```
8.38 0 104 30 2.37223 8.60074 3.51048 2.43954 8.76165 3.35465 -0.0922174 0.0568115 -0.0158445 14.6806 -69.2128 -5.58905 1 0 0 0 31.8125 0.23808 9.80003 -1.68896 0.265304 9.81549 -1.41344 -0.00506495 -0.00678097 -0.00566295 0.47196 -51.0499 43.2903 1 0 0 0 30.3125 9.65918 -1.65569 -0.0997967 9.64689 -1.55576 0.310404 0.00830026 0.00925038 -0.0175803 -61.1888 -38.9599 -58.1438 1 0 0 0
```

#Oczyszczanie bazy#
Do oczyszczania bazy użyłem narzędzia openrefine. Przydatne okazało się zwiększenie pamięci maszyny JVM do 4gb dzięki czemu nie musiałem dzielić plików z danymi na mniejsze (przy domyślnych ustawieniach openrefine się wysypywał).

Każdy wiersz zawiera 54 kolumny, w tym 9 zawierało dane błędne, a niektóre akcelerometry były nieskalibrowane. Na potrzeby tego zadania zostawiłem więc 9 ważniejszych kolumn i dałem im nazwy zgodne z dokumentacją. 

Zestaw danych zawierał pomiary, gdy badany nie wykonywał żadnych z analizowanych czynności (np. gdy czekał na ustawienie urządzeń) - te dane usunąłem, gdyż zgodnie z dokumentacją nie powinny być brane pod uwagę. 

Zamieniłem również ActivityID na odpowiednik słowny.

if(value==1,"lying",
if(value==2,"sitting",
if(value==3,"standing",
if(value==4,"walking",
if(value==5,"running",
if(value==6,"cycling",
if(value==7,"Nordic walking",
if(value==9,"watching TV",
if(value==10,"computer work",
if(value==11,"car driving",
if(value==12,"ascending stairs",
if(value==13,"descending stairs",
if(value==16,"vacuum cleaning",
if(value==17,"ironing",
if(value==18,"folding laundry",
if(value==19,"house cleaning",
if(value==20,"playing soccer",
if(value==24,"rope jumping","Other"))))))))))))))))))

Na koniec do zestawu dodałem kolumnę z ID użytkownika, który wykonywał dane czynności (każdy plik był zestawem danych od jednego badanego, łącznie 9 plików)

#####Przykładowy rekord po oczyszczeniu#####

```
{
    "_id" : ObjectId("52bd96f98537248bcd1016bf"),
    "Subject" : 1,
    "Timestamp" : 37.7,
    "ActivityID" : "lying",
    "HeartRate" : 100,
    "HandTemperature" : 30.375,
    "X" : 2.30106,
    "Y" : 7.25857,
    "Z" : 6.09259,
    "ChestTemperature" : 32.1875,
    "AnkleTemperature" : 30.75
}
```

Gdzie X,Y,Z to dane z najdokładniejszego akcelerometru.

Przed importem połączyłem pliki w jeden poleceniem:

```
cat subject101.csv subject102.csv subject103.csv subject104.csv subject105.csv subject106.csv subject107.csv subject108.csv subject109.csv > subjects.csv
```

Baza po oczyszczeniu zawiera 1 942 872 rekordów.

#MongoDB#

####Import####

```
mongoimport --db nosql --headerline --collection activities --type csv subjects.csv
```

###Agregacja 1### 
Jaki jest średni puls podczas wykonywania danej aktywności?

```
db.activities.aggregate(   
{ $group: {_id: "$ActivityID", Avarage: {$avg: "$HeartRate"}} },   
{ $sort: {Avarage: -1} } );
```

{
	"result" : [
		{
			"_id" : "rope jumping",
			"Avarage" : 161.98139122729287
		},
		{
			"_id" : "running",
			"Avarage" : 156.59581411049848
		},
		{
			"_id" : "ascending stairs",
			"Avarage" : 129.52348491922683
		},
		{
			"_id" : "descending stairs",
			"Avarage" : 129.15417491921193
		},
		{
			"_id" : "cycling",
			"Avarage" : 124.8799521403882
		},
		{
			"_id" : "Nordic walking",
			"Avarage" : 123.82870101174555
		},
		{
			"_id" : "walking",
			"Avarage" : 112.78986505095016
		},
		{
			"_id" : "vacuum cleaning",
			"Avarage" : 104.1980908410282
		},
		{
			"_id" : "ironing",
			"Avarage" : 90.06959118052366
		},
		{
			"_id" : "standing",
			"Avarage" : 88.55763688760807
		},
		{
			"_id" : "sitting",
			"Avarage" : 80.01258195995038
		},
		{
			"_id" : "lying",
			"Avarage" : 75.53568181818181
		}
	],
	"ok" : 1
}

http://savedbythegoog.appspot.com/?id=1353d78e9116e42ce61ad82634554fb942e5ce4f

###Agregacja 2###

Jaka jest średnia temperatury ciała (średnia z kostki, klatki piersiowej i ręki)?

```
db.activities.aggregate(   
{ $group: {_id: "$ActivityID", HandAvarage: {$avg: "$HandTemperature"}, ChestAvarage: {$avg: "$ChestTemperature"}, AnkleAvarage: {$avg: "$AnkleTemperature"} } },
{ $sort: {ChestAvarage: -1} } );
```

```
{
	"result" : [
		{
			"_id" : "vacuum cleaning",
			"HandAvarage" : 34.17831337501854,
			"ChestAvarage" : 37.05787697314751,
			"AnkleAvarage" : 34.45198847574939
		},
		{
			"_id" : "ascending stairs",
			"HandAvarage" : 33.527138964984594,
			"ChestAvarage" : 37.05414259689063,
			"AnkleAvarage" : 34.17119746141765
		},
		{
			"_id" : "descending stairs",
			"HandAvarage" : 33.32202388327123,
			"ChestAvarage" : 37.02197810052033,
			"AnkleAvarage" : 34.167660356941965
		},
		{
			"_id" : "walking",
			"HandAvarage" : 32.296968432464055,
			"ChestAvarage" : 37.00610797903883,
			"AnkleAvarage" : 33.84965908610783
		},
		{
			"_id" : "ironing",
			"HandAvarage" : 34.02262048041197,
			"ChestAvarage" : 36.664992284985914,
			"AnkleAvarage" : 34.27756174511014
		},
		{
			"_id" : "standing",
			"HandAvarage" : 33.63796620507227,
			"ChestAvarage" : 36.164724799523704,
			"AnkleAvarage" : 33.89724467691657
		},
		{
			"_id" : "Nordic walking",
			"HandAvarage" : 31.54639360821862,
			"ChestAvarage" : 36.15808872448572,
			"AnkleAvarage" : 33.443025463285494
		},
		{
			"_id" : "sitting",
			"HandAvarage" : 33.26220443183354,
			"ChestAvarage" : 35.82410531006914,
			"AnkleAvarage" : 33.63711284861204
		},
		{
			"_id" : "cycling",
			"HandAvarage" : 31.008457424177962,
			"ChestAvarage" : 35.72589187488983,
			"AnkleAvarage" : 33.17297999498268
		},
		{
			"_id" : "lying",
			"HandAvarage" : 32.72601858201124,
			"ChestAvarage" : 35.08629064750072,
			"AnkleAvarage" : 32.976275815040914
		},
		{
			"_id" : "running",
			"HandAvarage" : 30.834631160259857,
			"ChestAvarage" : 34.39901956781365,
			"AnkleAvarage" : 33.12962437468542
		},
		{
			"_id" : "rope jumping",
			"HandAvarage" : 29.71846203464799,
			"ChestAvarage" : 33.60202318170712,
			"AnkleAvarage" : 32.03452579250124
		}
	],
	"ok" : 1
}
```

http://savedbythegoog.appspot.com/?id=20cfc6fa53da0d9b745707d00e108511323ee5e6

Wyniki są dość zaskakujące. Wydawać by się mogło, że największą temperaturę będę miały aktywności wymagające większego wysiłku. Możemy jednak zauważyć, że w trakcie trwania "zajęć domowych" temperatura ciała jest wyższa od zajęć wykonywanych na zewnątrz. Wniosek jest więc taki, że temperatura otoczenia może wpływać na wynik.


###ELASTIC SEARCH###

Najpierw, do wygenerowania jednolinijkowych jsonów, użyłem bazy mongo. Polecenie mongoexport nie umożliwia wykluczenie pola ObjectID, więc użyłem:

```
$ time ./mongo nosql --quiet --eval "db.activities.find({}, {_id:0}).forEach(printjson);" > out.txt

real	0m55.439s
user	0m45.121s
sys	0m3.523s
```

Teraz wystarczy tylko zmienić format "pretty json" na jednolinijkowiec korzystając z jq.

```
$ cat out.json | jq -c . > activities_mongo.json
```

Następnie do wygenerowania "przeplatanych" JSONów ponownie użyłem jq.

```
$ time cat activities.json | jq --compact-output '{ "index": { "_type": "pamap" } }, .' > activities.bulk
```

Pozostał już tylko import:

```
$ curl -s -XPOST localhost:9200/pamap/_bulk --data-binary @activities.bulk
```

Niestety, brakuje pamięci. Podobnie jak w OpenRefine zwiększyłem ilość pamięci dla JVM. 
Zmieniłem zmienną ES_HEAP_SIZE=4000m (domyślnie jest 1gb)

Znalazłem również informację, że ES zachowuje się słabo, gdy korzysta z pamięci swap. Zmieniłem zmienną bootstrap.mlockall=true
Pozwoliłem również procesowi ES na zablokowanie pamięci poleceniem ulimit -l unlimited

Powyższe zmiany niestety nie pomogły zaimportować pliku w całości, podzieliłem więc go po 0.5mln wierszy (1 mln to było wciąż za dużo)
```
$ split -n 500000 activities.bulk
```

```
$ time for i in x*; do curl -s -XPOST localhost:9200/pamap/_bulk --data-binary @$i; done

real	13m54.575s
user	0m0.665s
sys	0m4.433s
```

#####Sprawdzenie#####
```
$ curl -XGET 'http://localhost:9200/pamap/pamap/_count'; echo

{"count":1942872,"_shards":{"total":5,"successful":5,"failed":0}}
```

Liczba rekordów się zgadza, import trwał niecałe 14 minut.

###Agregacja 3###

Długość monitorowania danych aktywności.

```
curl -X POST "http://localhost:9200/pamap/pamap/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "ActivityID" : {
            "terms" : {
                "field" : "ActivityID"
            }
        }
    }
}
' | jq . > agg3.js
```

http://savedbythegoog.appspot.com/?id=1b5885f6cd90e9894e8a1c54f432c3ea8cba019b


###Agregacja 4###

Zaangażowanie poszczególnych badanych.

```
curl -X POST "http://localhost:9200/pamap/pamap/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "Subject" : {
            "terms" : {
                "field" : "Subject"
            }
        }
    }
}
' | jq . > agg4.js
```

http://savedbythegoog.appspot.com/?id=88ba631a18fa54773e00a8d29291ae1b5d77587a

