#### Oskar Duwe

----

### *Konfiguracja sprzętu*

**Procesor:** Intel i5-4670K (3,4GHz na rdzeń)<br>
**Dysk twardy:** Seagate Barracuda ST1000DM003 1TB 7200 RPM 64MB Cache SATA 6.0Gb/s<br>
**RAM:** DDR3 2x8GB 1333MHz CL9<br>
**System operacyjny:** Archlinux x86_64


## Zadanie 1
### 1. *Wyszukać w sieci dane zawierające co najmniej 1_000_000 rekordów/jsonów.*
Skorzystałem z bazy danych serwisu [IMDB](http://www.imdb.com/). Jest to baza zawierająza pozycje z lat 2007-12 (filmy i seriale).<br>
**Baza (link):** [getglue_sample.tar.gz](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz)<br>
**Rozmiar (po rozpakowaniu):** 10,7GiB (19 831 300 rekordów)

### 2. *Dane zapisać w bazach MongoDB i Elasticsearch.*
Pobrany plik bazy rozpakowałem poleceniem:
```sh
time tar -xf getglue_sample.tar.gz
```
Rozpakowywanie zajęło 58,6 sekund, następnie wykonałem właściwy import do bazy poleceniem:
```sh
time mongoimport -d zad2 -c zad2 --type json --file getglue_sample.json
```
Import zakończył się sukcesem:
```sh
Sun Jan 19 21:05:36.254                 Progress: 11368298055/11454208342       99%
Sun Jan 19 21:05:36.254                         19680400        39282/second
Sun Jan 19 21:05:39.029                 Progress: 11437668569/11454208342       99%
Sun Jan 19 21:05:39.029                         19802300        39290/second
Sun Jan 19 21:05:39.647 check 9 19831300
Sun Jan 19 21:05:39.819 imported 19831300 objects
```
I zajął:
```sh
real    8m24.475s
user    3m5.031s
sys     0m6.550s
```

Zgodnie z wynikiem baza po imporcie zawiera 19831300 rekordów:
```sh
[einstein@Enkelados Bazy]$ mongo
MongoDB shell version: 2.4.9
connecting to: test
> use zad2
switched to db zad2
> db.zad2.count()
19831300
```

### 3. *Agregacje*

####Agregacja 1
Wypisz 5 najpopularniejszych filmów.

**Kod agregacji:**
```js
//agregacja1.js

var result = db.zad2.aggregate(
  { $match: { "modelName": "movies" } },
  { $group: {_id: "$title", ilosc: {$sum: 1} } },
  { $sort: { ilosc: -1} },
  { $limit: 5}
);

printjson(result);
```

**Wynik działania skryptu:**

```sh
[einstein@Enkelados Bazy]$ time mongo zad2 agregacja1.js 
MongoDB shell version: 2.4.9
connecting to: zad2
{
        "result" : [
                {
                        "_id" : "The Twilight Saga: Breaking Dawn Part 1",
                        "ilosc" : 87527
                },
                {
                        "_id" : "The Hunger Games",
                        "ilosc" : 79343
                },
                {
                        "_id" : "Marvel's The Avengers",
                        "ilosc" : 64372
                },
                {
                        "_id" : "Harry Potter and the Deathly Hallows: Part II",
                        "ilosc" : 34001
                },
                {
                        "_id" : "The Muppets",
                        "ilosc" : 29002
                }
        ],
        "ok" : 1
}
```

**Czas działania:**
```sh
real    1m10.724s
user    0m0.020s
sys     0m0.002s
```

####Agregacja 2
Wypisz pięciu reżyserów z największą liczbą filmów:

**Kod agregacji:**
```js
//agregacja2.js

var result = db.zad2.aggregate( 
    { $match: { "modelName": "movies"} },
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit: 5}
    );
    
printjson(result);
```

**Wynik działania skryptu:**
```sh
[einstein@Enkelados Bazy]$ time mongo zad2 agregacja2.js
MongoDB shell version: 2.4.9
connecting to: zad2
{
        "result" : [
                {
                        "_id" : "not available",
                        "count" : 1474
                },
                {
                        "_id" : "various directors",
                        "count" : 54
                },
                {
                        "_id" : "alfred hitchcock",
                        "count" : 50
                },
                {
                        "_id" : "michael curtiz",
                        "count" : 48
                },
                {
                        "_id" : "woody allen",
                        "count" : 47
                }
        ],
        "ok" : 1
}
```

**Czas działania:**
```sh
real    1m10.628s
user    0m0.020s
sys     0m0.002s
``` 
