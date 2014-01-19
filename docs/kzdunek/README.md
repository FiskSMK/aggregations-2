### *Kamil Zdunek*

----

### *Konfiguracja sprzętu*

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/0_dane_tech.png)

## Zadanie 1
### a) Import danych z pliku CSV do bazy danych MongoDB

Modyfikacja pliku CSV skryptem prowadzącego zajęcia (2unix.sh), z powodu łamania się linii:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/2_przesiew.png)

Po modyfikacji:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/3_przesiew_end.png)

Import za pomocą:
```
time mongoimport --type csv -c Train --file ./Train2.csv --headerline
```
Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/4_import_end.png)

### b) Zliczanie ilośći zaimportowanych rekordów
```
db.zadanie.count();
```

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/5_potw_count.png)


### c) Zmiana formatu danych + zliczenie tagów i wszystkich różnych tagów

Do konwersji tagów napisałem skrypt w języku java ([txt](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/StringTest.txt), [java](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/StringTest.java) )

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/Skrypt.png)
`
Czas działania skryptu: 15min
`

### d) Zliczanie liczby słów oraz liczby różnych słów. Wyliczenia procentowe.

Import danych do bazy:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/7_text8_import_end.png)

Wszystkie słowa: 

`
db.text8.count();
`

`
17005207
`

Wszystkie różne słowa: 

`
db.text8.distinct("word").length;
`

`
253854
`

Najczęściej występujące słowo:
<pre><code>
    db.text8.aggregate(
    { $group : { _id: "$word", value: {"$sum": 1}}
    },
    {$sort: {value: -1}},
    {$limit: 1},
    ).result[0].value / db.text8.count() * 100
</code></pre>

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/text8limit1.png)

    10 najczęściej występujących słów:

<pre><code>
    db.text8.aggregate(
    { $group : { _id: "$word", value: {"$sum": 1}}
    },
    {$sort: {value: -1}},
    {$limit: 10},
    {$group : {_id: null, sum: {"$sum": "$value"}}}
    ).result[0].sum / db.text8.count() * 100
</code></pre>

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/text8limit2.png)

    100 najczęściej występujących słów:

<pre><code>
    db.text8.aggregate(
    { $group : { _id: "$word", value: {"$sum": 1}}
    },
    {$sort: {value: -1}},
    {$limit: 100},
    {$group : {_id: null, sum: {"$sum": "$value"}}}
    ).result[0].sum / db.text8.count() * 100
</code></pre>

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/text8limit3.png)

    1000 najczęściej występujących słów:

<pre><code>
    db.text8.aggregate(
    { $group : { _id: "$word", value: {"$sum": 1}}
    },
    {$sort: {value: -1}},
    {$limit: 1000},
    {$group : {_id: null, sum: {"$sum": "$value"}}}
    ).result[0].sum / db.text8.count() * 100
</code></pre>

Rezultat:

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/text8limit4.png)

### e) GeoJSON

Skorzystałem z bazy danych lotnisk znalezionej tu: [airports.csv](http://www.ourairports.com/data/airports.csv)

Przykładowy rekord:

```json
{
        "_id" : ObjectId("528e8134556062edda13000d"),
        "continent" : "NA",
        "elevation_ft" : 150,
        "gps_code" : "00SC",
        "home_link" : "",
        "iata_code" : "",
        "id" : 6561,
        "ident" : "00SC",
        "iso_country" : "US",
        "iso_region" : "US-SC",
        "keywords" : "",
        "latitude_deg" : 34.0093994140625,
        "local_code" : "00SC",
        "longitude_deg" : -80.2671966552734,
        "municipality" : "Sumter",
        "name" : "Flying O Airport",
        "scheduled_service" : "no",
        "type" : "small_airport",
        "wikipedia_link" : ""
}
```

Rekord po dostosowaniu go do wymogów zadania:

```json
{
        "_id" : ObjectId("528e8134556062edda13000d"),
        "continent" : "NA",
        "elevation_ft" : 150,
        "gps_code" : "00SC",
        "home_link" : "",
        "iata_code" : "",
        "id" : 6561,
        "ident" : "00SC",
        "iso_country" : "US",
        "iso_region" : "US-SC",
        "keywords" : "",
        "latitude_deg" : 34.0093994140625,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -80.2671966552734,
                        34.0093994140625
                ]
        },
        "local_code" : "00SC",
        "longitude_deg" : -80.2671966552734,
        "municipality" : "Sumter",
        "name" : "Flying O Airport",
        "scheduled_service" : "no",
        "type" : "small_airport",
        "wikipedia_link" : ""
}
```


Import do bazy:
![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/airportsimp.png)

I. 7 lotnisk leżących najbliżej lotniska Chopina w Warszawie

```javascript
db.airports.find({"name":"Warsaw Chopin Airport"}).forEach(function(input) { d = input.loc })
db.airports.find( { loc: {$near:{$geometry:d}}}, {_id:0, iso_country:1, name:1, loc: 1}).skip(1).limit(7).pretty()
```



```json
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        20.9109992980957,
                        52.2685012817383
                ]
        },
        "name" : "Babice Airport"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        21.1988906860352,
                        52.2169418334961
                ]
        },
        "name" : "Międzylesie Airport"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        21.1870002746582,
                        52.0750007629395
                ]
        },
        "name" : "Konstancin-Jeziorna Airfield"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        21.2811107635498,
                        52.184440612793
                ]
        },
        "name" : "Góraszka Airport"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        20.6518001556,
                        52.4510993958
                ]
        },
        "name" : "Modlin Airport"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        20.5391693115234,
                        52.4736099243164
                ]
        },
        "name" : "Kroczewo Airport"
}
{
        "iso_country" : "PL",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        20.8730564117432,
                        52.5758323669434
                ]
        },
        "name" : "Chrcynno Airport"
}
```

II. Wszystkie duże lotniska w promieniu 500km od Sydney włącznie.

```javascript
function km(i) { return i/111.2 } // zamiana stopni na km
db.airports.find({loc: {$geoWithin: {$center: [[151.209900,-33.8651437],km(500)]}}, "type": "large_airport"}, {_id:0, iso_country:1, name:1, loc: 1, type: 1}).pretty()
```



```json
{
        "iso_country" : "AU",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        149.195007324219,
                        -35.3069000244141
                ]
        },
        "name" : "Canberra International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "AU",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        151.177001953125,
                        -33.9460983276367
                ]
        },
        "name" : "Sydney Kingsford Smith International Airport",
        "type" : "large_airport"
}
```

III. Pobrałem plik geojson z obszarem [Paryża]( (http://global.mapit.dev.mysociety.org/area/29746.geojson).

Lotniska w Paryżu posortowane malejąco względem pola elevation_ft (wysokość nad poziomem morza w stopach - 1ft ~ 1/3m).

```javascript
var a
var b = db.paris.find()
b.forEach(function(input){a=input})
db.airports.find({loc: {$geoWithin: {$geometry:a}}}).sort({elevation_ft: -1}).pretty()
```



```json
{
        "_id" : ObjectId("528e813c556062edda1346a7"),
        "continent" : "EU",
        "elevation_ft" : 262,
        "gps_code" : "",
        "home_link" : "",
        "iata_code" : "",
        "id" : 43425,
        "ident" : "FR-0085",
        "iso_country" : "FR",
        "iso_region" : "FR-J",
        "keywords" : "",
        "latitude_deg" : 48.8827781677246,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        2.35444402694702,
                        48.8827781677246
                ]
        },
        "local_code" : "",
        "longitude_deg" : 2.35444402694702,
        "municipality" : "Paris",
        "name" : "Centre Hospitalier Lariboisiere Heliport",
        "scheduled_service" : "no",
        "type" : "heliport",
        "wikipedia_link" : ""
}
{
        "_id" : ObjectId("528e813c556062edda1346a6"),
        "continent" : "EU",
        "elevation_ft" : 255,
        "gps_code" : "",
        "home_link" : "",
        "iata_code" : "",
        "id" : 43424,
        "ident" : "FR-0084",
        "iso_country" : "FR",
        "iso_region" : "FR-J",
        "keywords" : "",
        "latitude_deg" : 48.8372230529785,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        2.36138892173767,
                        48.8372230529785
                ]
        },
        "local_code" : "",
        "longitude_deg" : 2.36138892173767,
        "municipality" : "Paris",
        "name" : "Centre Hospitalier La Pitié Salpétriere Heliport",
        "scheduled_service" : "no",
        "type" : "heliport",
        "wikipedia_link" : ""
}
{
        "_id" : ObjectId("528e813f556062edda13646b"),
        "continent" : "EU",
        "elevation_ft" : 112,
        "gps_code" : "LFPI",
        "home_link" : "",
        "iata_code" : "JDP",
        "id" : 30241,
        "ident" : "LFPI",
        "iso_country" : "FR",
        "iso_region" : "FR-J",
        "keywords" : "",
        "latitude_deg" : 48.8333015441895,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        2.27277994155884,
                        48.8333015441895
                ]
        },
        "local_code" : "",
        "longitude_deg" : 2.27277994155884,
        "municipality" : "Issy-les-Moulineaux",
        "name" : "Paris Issy-les-Moulineaux Heliport",
        "scheduled_service" : "no",
        "type" : "heliport",
        "wikipedia_link" : ""
}
```

IV. Wszystkie lotniska leżące wzdłuż równika.

```javascript
var my_line = {type : "LineString" , coordinates : [[180.0, 0.0] , [0.0 , 0.0] , [-180.0, 0.0]]}
db.airports.find({loc:{$geoIntersects:{$geometry:my_line}}}).pretty()
```



```json
{
        "_id" : ObjectId("528e813c556062edda134af8"),
        "continent" : "SA",
        "elevation_ft" : "",
        "gps_code" : "",
        "home_link" : "",
        "iata_code" : "GIG",
        "id" : 308082,
        "ident" : "GIG",
        "iso_country" : "BR",
        "iso_region" : "BR-RJ",
        "keywords" : "",
        "latitude_deg" : 0,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        0,
                        0
                ]
        },
        "local_code" : "RIO",
        "longitude_deg" : 0,
        "municipality" : "",
        "name" : "TOM JOBIM",
        "scheduled_service" : "no",
        "type" : "large_airport",
        "wikipedia_link" : ""
}
{
        "_id" : ObjectId("528e8147556062edda13ab44"),
        "continent" : "OC",
        "elevation_ft" : 1555,
        "gps_code" : "YFDF",
        "home_link" : "",
        "iata_code" : "KFE",
        "id" : 301103,
        "ident" : "YFDF",
        "iso_country" : "AU",
        "iso_region" : "AU-WA",
        "keywords" : "",
        "latitude_deg" : 0,
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        119.429161111,
                        0
                ]
        },
        "local_code" : "",
        "longitude_deg" : 119.429161111,
        "municipality" : "Cloudbreak Village",
        "name" : "Fortescue - Dave Forrest Aerodrome",
        "scheduled_service" : "no",
        "type" : "small_airport",
        "wikipedia_link" : ""
}
```

V. Wyświetl wszystkie duże lotniska leżące wewnątrz prostokątu [-90,35], [-60,35], [-60,30], [-90,30]:

```javascript
db.airports.find({
    loc: {$geoWithin: {
        $geometry: {type: "Polygon", coordinates: [[[-90,35], [-60,35], [-60,30], [-90,30], [-90,35]]]} 
    } },
    "type" : "large_airport"},
    {_id:0, iso_country:1, name:1, loc: 1, type: 1}
 ).pretty()
```


```json
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -80.9430999755859,
                        35.2140007019043
                ]
        },
        "name" : "Charlotte Douglas International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -82.2189025879,
                        34.8956985474
                ]
        },
        "name" : "Greenville Spartanburg International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -82.5418014526367,
                        35.4361991882324
                ]
        },
        "name" : "Asheville Regional Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -85.2037963867188,
                        35.0353012084961
                ]
        },
        "name" : "Lovell Field",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -86.7751007080078,
                        34.6371994018555
                ]
        },
        "name" : "Huntsville International Carl T Jones Field",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -88.4438018799,
                        33.6437988281
                ]
        },
        "name" : "Columbus Air Force Base",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -86.75350189,
                        33.56290054
                ]
        },
        "name" : "Birmingham-Shuttlesworth International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -86.39399719,
                        32.30059814
                ]
        },
        "name" : "Montgomery Regional (Dannelly Field) Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -86.5253982543945,
                        30.4832000732422
                ]
        },
        "name" : "Eglin Air Force Base",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -88.2427978515625,
                        30.6912002563477
                ]
        },
        "name" : "Mobile Regional Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -89.0700988769531,
                        30.4073009490967
                ]
        },
        "name" : "Gulfport Biloxi International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -83.5919036865,
                        32.6400985718
                ]
        },
        "name" : "Robins Air Force Base",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -84.4281005859375,
                        33.6366996765137
                ]
        },
        "name" : "Hartsfield Jackson Atlanta International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -84.51629639,
                        33.91540146
                ]
        },
        "name" : "Dobbins Air Reserve Base Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -81.119499206543,
                        33.9388008117676
                ]
        },
        "name" : "Columbia Metropolitan Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -81.9645004272461,
                        33.3698997497559
                ]
        },
        "name" : "Augusta Regional At Bush Field",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -81.20210266,
                        32.12760162
                ]
        },
        "name" : "Savannah Hilton Head International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -80.04049683,
                        32.89860153
                ]
        },
        "name" : "Charleston Air Force Base-International Airport",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -80.47059631,
                        33.97269821
                ]
        },
        "name" : "Shaw Air Force Base",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -78.9282989501953,
                        33.6796989440918
                ]
        },
        "name" : "Myrtle Beach International Airport",
        "type" : "large_airport"
}

{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -77.96060181,
                        35.33940125
                ]
        },
        "name" : "Seymour Johnson Air Force Base",
        "type" : "large_airport"
}
{
        "iso_country" : "US",
        "loc" : {
                "type" : "Point",
                "coordinates" : [
                        -78.7874984741211,
                        35.8776016235352
                ]
        },
        "name" : "Raleigh Durham International Airport",
        "type" : "large_airport"
}
```

VI. Wszystkie lotniska leżące na drodze z Madrytu do Tokio (w linii prostej).

```javascript
db.airports.find( 
    {loc: {$geoIntersects: {
        $geometry: {type: "LineString", coordinates: [ [3,40], [139,35] ]}
    }}
}).count()
```

```sh
0
```

I

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/airports1.png)

II

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/airports2.png)

III

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/airports3.png)

V

![img](http://sigma.inf.ug.edu.pl/~kzdunek/mongo/airports4.png)
