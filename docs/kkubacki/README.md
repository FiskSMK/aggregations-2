### *Konrad Kubacki*

### Środowisko testowe.
##### Windows 8.1 pro 64 bit , core i5 8GB ram 750GB 7200 obr/min.
#####Do wykonywania poleceń linuxowych wykorzystywałem cygwina.
#####Przy importowaniu baz danych Pamięć ram była obciążona maksymalnie, natomiast użycie procesora wynosiło ok 35%.
----

## Zadanie 1
### a) Import danych z pliku CSV do bazy danych
```
mongoimport -d mydb -c train -type csv -file TrainPoprawiony.csv --headerline
```
rezultat:
```
imported 6034195 objects
```
Zeby móc zaimportować bazę danych do mongo musiałem oczyścić bazę za pomocą następujecego  [Skryptu](/docs/kkubacki/wbfix.sh)
Pierwszy nieudany import trwał jakieś 6 może 7 godzin , następny import po uprzednim oczyszczeniu pliku Train trwał około 30min.


### b) Zliczanie ilośći zaimportowanych rekordów
```
db.train.count();
```
Rezultat jest sporo większy niż oczekiwany.
```
21 768 811
```
### b) Zamienić string z tagami na tablice stringów.
W tym podpunkcie napisąłem prosty program w C# który to zrobił. program jest dostępny pod https://bitbucket.org/konrad_kubacki/nosql
Pomysł jest prosty. tj. mamy Klasę Element , która reprezentuję nasz pojedyńczy dokument z mongodb następnie importujemy za pomocą sterownika mongo db.
Do klasy Element dodajemy propercję która jest listą stringów  po wcześniejszym wykonaniu splita na propercji Tags.

 
### d) Import z pliku do bazy danych
Import za pomocą:
```
mongoimport --type csv -f word -d text8 -c text8 --file text8.txt
```
Rezultat:
```
imported 17005207 objects
```
#####Zliczanie ilośc słów w bazie text8
Wszytskie słowa: ``` db.text8.count() ``` Otrzymamy: ``` 17005207 ```

Zliczanie wszystkich unikalnych słów za pomocą ``` db.text8.distinct("word").length ``` Otrzymamy: ``` 253854 ```

Zliczanie 1/10/100/1000 najczęściej występujących słów, gdzie IloscSlow IN (1,10,100,1000)
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:IloscSlow}, {$group:{_id: null, count:{$sum:"$count"}}} ])
```
Ilość wszystkich słów: 17005207.
``` db.text8.count() ```

Udział procentowy wygląda następująco:

|Limit       | Ilość słów  | Udział %	           |      
|:-----------|------------:|:---------:|
| 1          |1061396      | 6.24%     |      
| 10         |4205965      | 24.73%    |
| 100        |7998978      | 47%       |
| 1000       |11433354     | 67%       |

### d) Zadanie z GeoJson

Bazę można znaleść pod następującym linkiem:  http://geonames.usgs.gov/docs/stategaz/NationalFile_2013102 Baza zawiera dane z hrabstw z USA.
Plik należy oczyścić przez zamianę znaku ``` | ``` na ``` , ``` możemy zrobić to polecenien  ``` tr ``` 
``` tr '|' ',' < Geojson1 > geoPoprawiony.txt ```
Następnie importujemy do bazy.
``` mongoimport -d geo -c geo -type csv -file  geoPoprawiony.txt --headerline ```
Rezultat: 
``` imported 2251155 objects ```
Następnie musimy przeczyścić naszą bazę danych przez wykorzystanie dwóch skryptów: [Fix1](/docs/kkubacki/GeoFix1) [Fix2](/docs/kkubacki/GeoFix2)
Aby móc korzystać z poleceń Geospatial Queries musimy odpowiednio przygotować naszą bazę danych przez uruchomienie nestępującej komendy:
 ``` db.geo_points.ensureIndex({"loc" : "2dsphere"}) ``` 
Następnie żeby wykonywać zapytania musimy stworzyć punkt możemy to zrobić tak:
 
``` var punkt = {type: "Point", coordinates: [-95.9979,41.2524]} ```
Majac ten punkt możemy wykonywać zapytania.

####zapytanie 1 Wszystkie obiekty w odległości 5000m od  punktu o współrzędnych -108.4147341, 35.4114147
``` db.geo_points.find({ loc: {$near: {$geometry: punkt}, $maxDistance: 5000} }) ```
Wynik zapytania: [tutaj](/docs/kkubacki/zapytania/zap1)

####zapytanie 2: znajdź  doliny  pomiędzy Nebraska, Omaha, Indianapolis oraz Chicago
```
var punkt =  {type: "Point", coordinates: [-108.4147341,35.4114147]}
db.geo_points.find( { loc :
                  { $geoWithin :
                    { $geometry :
                      { type : "Polygon" ,
                        coordinates: [ [ [ -95.9979,41.2524 ] , [ -98.0000,38.5000, ] , [ - 86.1480,39.7910] , [ -87.6279,41.8819 ],[ -95.9979,41.2524 ] ] ]
                } } },
            type: "Valley"} )

```
Wynik zapytania: [tutaj](/docs/kkubacki/zapytania/zap2)


####zapytanie 3:  Znajdź 10 dolin  najbliżej punktu -108.4295458, 32.4184978 o wysokości max 300metrów
```  db.geo_points.find({ loc: {$near: {$geometry: punkt}}, type:"Valley", height: {$lt:300} }).limit(10) ```
Wynik zapytania: [tutaj](/docs/kkubacki/zapytania/zap3)

####Zapytanie 4: Znajdź wszystkie obiekty w linii prostej między  Red Bluff a Carson city	 

```
db.geo_points.find( {loc: 
    {$geoIntersects: 
        {$geometry: 
            {type: "LineString", coordinates: [ [ -122.2358300, 40.1784900	], [-151.0060501, 63.0693461] ]}}}})
```
Wynik zapytania: [tutaj](/docs/kkubacki/zapytania/zap4)

####Zapytanie 5: Ilość szpitali leżących 5000m od Sakramento.
```
db.geo_points.find({ loc: {$near: {$geometry: {
          type: "Point", coordinates: [-121.468889,38.555556]
          }}, $maxDistance: 5000},
          type:"Hospital" }).count())
```
Rezultat:  ``` 8 ```
####Zapytanie 6: Znajdź wszystkie szczyty leżące maksymalnie 100km od Las Vegas położone na wysokości co najmwyżej 3000m
```
db.geo_points.find({ loc: 
    {$near: 
        {$geometry: 
            {type: "Point", coordinates: [-115.1522,36.0800]}}, 
                $maxDistance : 100000  },
    type: "Summit",
    height: {$lt:3000} })
```
Wynik zapytania: [tutaj](/docs/kkubacki/zapytania/zap6)

## Zadanie 2 
####Znalazłem bazę która przechowuję dane o lotniskach na świecie, bazę można pobrać z http://www.ourairports.com/data/airports.csv
####Pierwsza agregacja mongodb , policz ile jest różnych typów lotnisk. [zapytanie](/docs/kkubacki/zapytania/mongoQuery1.js)
####[Wynik zapytania ](/docs/kkubacki/zapytania/WynikMongo1.txt)

####Druga agregacja dla mongodb, policz ile jest lotnisc w poszczególnych krajach.
####Wyniki mogą być zaskoczeniem, w Polsce jest niby 170 lotnisk! [Oto one](/docs/kkubacki/zapytania/LotniskaPolskie.txt)

####Pierwsza agregacja dla elasticSeach.
#### pokaż 5 krajów które mają największą ilośc lotnisk. [zapytanie](/docs/kkubacki/zapytania/zapytanieES1.js)
[wynik](/docs/kkubacki/zapytania/agqWyniki1.js)

#### pokaż 5 krajów które mają największą ilośc lotnisk. [zapytanie](/docs/kkubacki/zapytania/zapytanieES1.js)
[wynik](/docs/kkubacki/zapytania/agqWyniki1.js)

#### pokaż 10 jednostek terytorialnych które mają największą ilośc lotnisk. [zapytanie](/docs/kkubacki/zapytania/zapytanieES2.js)
[wynik](/docs/kkubacki/zapytania/agqWyniki2.js)



