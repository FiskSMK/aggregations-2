## Damian Brzeziński


## Zadanie 2

### GDELT - The Global Database of Events, Language, and Tone.
What is GDELT?

The Global Database of Events, Language, and Tone (GDELT) is an initiative to construct a catalog of human societal-scale behavior and beliefs across all countries of the world over the last two centuries down to the city level globally, to make all of this data freely available for open research, and to provide daily updates to create the first "realtime social sciences earth observatory." Nearly a quarter-billion georeferenced events capture global behavior in more than 300 categories covering 1979 to present with daily updates.

GDELT is designed to help support new theories and descriptive understandings of the behaviors and driving forces of global-scale social systems from the micro-level of the individual through the macro-level of the entire planet by offering realtime synthesis of global societal-scale behavior into a rich quantitative database allowing realtime monitoring and analytical exploration of those trends...

- See more at: http://gdelt.utdallas.edu/about.html#sthash.9j8Oyn6K.dpuf

--------------------------------------------------------------------------------------------------------------------------
##MongoDB
### Przygotowanie danych do importu.

Powyżej opisana baza danych posiada dane z kilku lat i zatem miliony rekordów. Ja dla przykładu przygotowałem katalog z danymi z rocznika 1991 oraz 1993. 

Przykładowy rekord:

```
Day	Actor1Code	Actor2Code	EventCode	QuadCategory	GoldsteinScale	Actor1Geo_Lat	Actor1Geo_Long	Actor2Geo_Lat	Actor2Geo_Long	ActionGeo_Lat	ActionGeo_Long
19910101	AFG	GOV	040	2	1.0	34.5167	69.1833	34.5167	69.1833	34.5167	69.1833
```
Na pierwszy rzut oka wygląda dość niezrozumiale ale w tym rekordzie kryje się wiele istotnych informacji, są zakodowane za pomocą skrótów, które są wyjaśnione w podanych linkach:

Day nie trzeba tłumaczyć

- ActorCode (uczestnik) - http://gdelt.utdallas.edu/data/lookups/CAMEO.country.txt

- EventCode (wydarzenie) - http://gdelt.utdallas.edu/data/lookups/CAMEO.eventcodes.txt
- GoldsteinScale(skala pomocnicza do kodowania) - http://gdelt.utdallas.edu/data/lookups/CAMEO.goldsteinscale.txt

Oraz długości i szerokości geograficzne danych uczestników i miejsca wydarzenia.

######Google Refine
Dane są zapisane w plikach txt. Do importu musiałem przygotować pliki w formacie json w jednej linii za pomocą narzędzia
Google Refine. Dwa pliki zostały zimportowane do bazy, a nastepnie zliczone.

![img](../../images/dbrzezinski/refine.png)

```
time mongoimport --db gdelt --collection events--type json --file reduced_data_1993.json
```

###Czas importu ok. 1min 20sek.
![img](../../images/dbrzezinski/procesorr.png)
###Przykładowy rekord, oraz zliczenie kolekcji.
![img](../../images/dbrzezinski/przyk_json_count.png)

##AGREGACJE 
Za pomocą [skryptu](../../scripts/dbrzezinski/agre1_mdb.rb) policzyłem ile jest wszystkich eventów a w szczególności ile jest różnych eventów.

```
$ time ruby skrypt1.rb 
Wszystkie eventy: 1168616
Różne eventy: 250

real	0m1.636s
user	0m0.154s
sys	0m0.100s

```
###a) 10 najczęściej odbywających się wydarzeń

```
 db.events.aggregate({$group:{_id: "$EventCode", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 10});

{
	"result" : [
		{
			"_id" : 40,
			"count" : 96643
		},
		{
			"_id" : 42,
			"count" : 92531
		},
		{
			"_id" : 43,
			"count" : 90844
		},
		{
			"_id" : 10,
			"count" : 75939
		},
		{
			"_id" : 46,
			"count" : 71750
		},
		{
			"_id" : 36,
			"count" : 55415
		},
		{
			"_id" : 20,
			"count" : 53006
		},
		{
			"_id" : 190,
			"count" : 51970
		},
		{
			"_id" : 51,
			"count" : 41819
		},
		{
			"_id" : 173,
			"count" : 28314
		}
	],
	"ok" : 1
}

```
![img](../../images/dbrzezinski/eventy_wykr.png)

###b) 10 Państw które najczęściej uczestniczyły w jakichkolwiek eventach.

```
> db.events.aggregate({$group:{_id: "$Actor2Code", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 10});
{
	"result" : [
		{
			"_id" : "GOV",
			"count" : 93666
		},
		{
			"_id" : "USA",
			"count" : 61407
		},
		{
			"_id" : "RUS",
			"count" : 35844
		},
		{
			"_id" : "MIL",
			"count" : 31564
		},
		{
			"_id" : "ISR",
			"count" : 30724
		},
		{
			"_id" : "IRQ",
			"count" : 27450
		},
		{
			"_id" : "LEG",
			"count" : 22820
		},
		{
			"_id" : "MED",
			"count" : 21299
		},
		{
			"_id" : "CVL",
			"count" : 20717
		},
		{
			"_id" : "COP",
			"count" : 19419
		}
	],
	"ok" : 1
}

```
![img](../../images/dbrzezinski/panstwa_2.png)

------------------------------------------------------------------------------------------------------------------------
##ELASTICSEARCH

####1. Przygotownie pliku do importu.

Z bazy mongodb wykonałem eksport do pliku gdelt_es.json:

```
mongoexport -d gdelt -c events -o gdelt_es.json
```

Następnie zamieniłem na typ bulk za pomocą programu jq:

```
time cat gdelt_es.json | jq --compact-output '{ "index": { "_type": "gdelt" } }, .'  > gdelts.bulk

real	0m55.142s
user	0m51.731s
sys		0m3.170s
```

Import danych do bazy elasticsearch nie udał się z powodu zbyt dużego rozmiaru, więc trzeba było rozdzielić bazę na mniejsze części. 

Kiedy mamy już rozdzielone następuje import:

```
time for i in x*; do curl -s -XPOST   localhost:9200/gdelt/_bulk --data-binary @$i; done
real	9m59.174s
user	0m0.844s
sys		0m3.248s
```

Zliczenie:

```
curl -XGET 'http://localhost:9200/data/gdelt/_count' ; echo
{"count":1168616,"_shards":{"total":5,"successful":5,"failed":0}}
```


###1. Agregacja

#####a) 5 Najbardziej popularnych wydarzeń w które się odbyły.

Zapytanie:

```
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "EventCode" : {
            "terms" : {
                "field" : "EventCode",
                "size" : 5
            }
        }
    }
}
```
Wynik:

```
facets: {
 EventCode: {
  _type: terms,
  missing: 16599,
  total: 1168616,
  other: 854539,
   terms: [ {
	term:  40,
	count: 96643
	},
{
	term:  42,
	count: 92531
	},
{
	term:  43,
	count: 90844
	},
{
	term:  10,
	count: 75939
	},
{
	term:  46,
	count: 71750
	}
    ]
  }
 }
}
```
![img](../../images/dbrzezinski/wykre_elastic1.png)
