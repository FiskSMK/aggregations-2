<h1>Zadanie3</h2>

Dane do zadania3 pochodza ze strony www.transtats.bts.gov/DL_SelectFields.asp?Table_ID=236&DB_Short_Name=On-Time
Dotycza ruchu powietrznego na terenie USA w pierwszym kwartale 2013 roku. Dane na stronie podzielone sa wedlug miesiecy.

<h3>Import danych</h3>

import danych ze stycznia 2013:
```sh
	time mongoimport -d traffic -c air -type csv --headerline -file 433312457_T_ONTIME_2013_1.csv
	...
	Sun Dec  8 15:53:20.849 check 9 509520
	Sun Dec  8 15:53:21.112 imported 509519 objects
	
	real	1m6.898s
	user	0m39.148s
	sys	0m1.692s
```

import danych z lutego 2013:
```sh
	time mongoimport -d traffic -c air -type csv --headerline -file 433314029_T_ONTIME_2013_2.csv
	...
	Sun Dec  8 15:58:24.691 check 9 469747
	Sun Dec  8 15:58:25.012 imported 469746 objects
	
	real	1m2.581s
	user	0m35.540s
	sys	0m1.536s
```

import danych z marca 2013:
```sh
	time mongoimport -d traffic -c air -type csv --headerline -file 433314029_T_ONTIME_2013_3.csv 
	...
	Sun Dec  8 16:02:19.943 check 9 552313
	Sun Dec  8 16:02:20.327 imported 552312 objects
	
	real	1m13.893s
	user	0m42.136s
	sys	0m1.840s
```

Sprawdzenie liczby rekordow:
```sh
	> use traffic
	switched to db traffic
	> db.air.count()
	1531577
```
Przykladowy rekord:
```sh	
	> db.air.findOne()
	{
		"_id" : ObjectId("52a4879ea57524964ba8e4d7"),
		"QUARTER" : 1,
		"MONTH" : 1,
		"FL_DATE" : "2013-01-17",
		"AIRLINE_ID" : 20363,
		"CARRIER" : "9E",
		"TAIL_NUM" : "N923XJ",
		"ORIGIN_AIRPORT_ID" : 11298,
		"ORIGIN" : "DFW",
		"ORIGIN_CITY_NAME" : "Dallas/Fort Worth, TX",
		"DEST_AIRPORT_ID" : 12478,
		"DEST" : "JFK",
		"DEST_CITY_NAME" : "New York, NY",
		"DEP_DEL15" : 0,
		"DEP_DELAY_GROUP" : -1,
		"ARR_DEL15" : 0,
		"ARR_DELAY_GROUP" : -1,
		"CANCELLED" : 0,
		"DIVERTED" : 0,
		"AIR_TIME" : 175,
		"DISTANCE" : 1391,
		"CARRIER_DELAY" : "",
		"WEATHER_DELAY" : "",
		"NAS_DELAY" : "",
		"SECURITY_DELAY" : "",
		"LATE_AIRCRAFT_DELAY" : "",
		"" : ""
```	

<h3>Pierwsza redukcja</h3>

Funkcja pokazujaca dane dotyczace przewoznika i czasu lotu:
```sh
var mapFunction1 = function() {
	emit(this.CARRIER, this.AIR_TIME);
};
```

Funkcja zliczajaca wartosc danych na temat czasu lotu:
```sh
var reduceFunction1 = function(keyCustId, valuesAIR_TIME){
	return Array.sum(valuesAIR_TIME);
	};
```	
Redukcja:
```sh
db.air.mapReduce(
	mapFunction1,
	reduceFunction1,
	{ out: "map_reduce1" }
	)
```	
Wykonanie:
```sh	
MongoDB shell version: 2.4.8
connecting to: test
> use traffic
switched to db traffic
> var mapFunction1 = function() {
... emit(this.CARRIER, this.AIR_TIME);
... };
> var reduceFunction1 = function(keyCustId, valuesAIR_TIME){
... return Array.sum(valuesAIR_TIME);
... };
> db.air.mapReduce(
... mapFunction1,
... reduceFunction1,
... { out: "map_reduce1" }
... )
```

Wynik:
```sh
{
	"result" : "map_reduce1",
	"timeMillis" : 93065,
	"counts" : {
		"input" : 1531577,
		"emit" : 1531577,
		"reduce" : 15797,
		"output" : 16
	},
	"ok" : 1,
}
```
	
<h3>Druga redukcja</h3>

Funkcja pokazujaca dane dotyczace samolotu wedlug numeru rejestracyjnego i czasu lotu:	
```sh
	var mapFunction2 = function() {
	emit(this.TAIL_NUM, this.AIR_TIME);
};
```

Zliczanie wartosc danych na temat czasu lotu dla pojedynczego samolotu:
```sh
var reduceFunction2 = function(keyCustId, valuesAIR_TIME_BY_PLANE){
	return Array.sum(valuesAIR_TIME_BY_PLANE);
	};
```

Redukcja:	
```sh
db.air.mapReduce(
	mapFunction2,
	reduceFunction2,
	{ out: "flight_time_by_plane" }
	)	
```	
Wykonanie:
```sh
> var mapFunction1 = function() {
... emit(this.TAIL_NUM, this.AIR_TIME);
... };
> var reduceFunction1 = function(keyCustId, valuesAIR_TIME_BY_PLANE){
... return Array.sum(valuesAIR_TIME_BY_PLANE);
... };
> 
> db.air.mapReduce(
... mapFunction1,
... reduceFunction1,
... { out: "flight_time_by_plane" }
... )
```

Wynik:
```sh
{
	"result" : "flight_time_by_plane",
	"timeMillis" : 103675,
	"counts" : {
		"input" : 1531577,
		"emit" : 1531577,
		"reduce" : 125579,
		"output" : 4710
	},
	"ok" : 1,
}
```
	
