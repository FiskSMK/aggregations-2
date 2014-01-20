##Zadanie 1a.
Polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy:
MongoDB, PostgreSQL – opcjonalnie dla znających fanów SQL

Do naprawy pliku użyłem skryptu dostępnego na githubie. 
https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh
A tak wyglądało polecenie:
```
./2unix.sh Train.csv Train2.csv 
```
Polecenie importowania:
```
time mongoimport --collection Train --type csv --file Train2.csv --headerline
```
Dysk HDD 7200 podłączony kablem ATA - USB2.0
Czasy:
```
real 49m54.265s
user 2m01.345s
sys 0m13.934s
```

##Zadanie 1b.
Zliczyć liczbę zaimportowanych rekordów.
```
db.Train.count();     6034195
```
##Zadanie 1c.
(Zamiana formatu danych.) Zamienić string zawierający tagi na tablicę napisów z tagami następnie
zliczyć wszystkie tagi i wszystkie różne tagi. Napisać program, który to zrobi korzystając 
z jednego ze sterowników. Lista sterowników jest na stronie MongoDB Ecosystem.

Kod:
```
db.train.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.train.save(x);
}});
```


##Zadanie 1d.
ciągnąć plik text8.zip ze strony Matt Mahoney (po rozpakowaniu 100MB):
wget http://mattmahoney.net/dc/text8.zip -O text8.gz
Zapisać wszystkie słowa w bazie MongoDB. Następnie zliczyć liczbę słów oraz liczbę różnych słów w tym pliku.
Ile procent całego pliku stanowi: najczęściej występujące słowo w tym pliku, 10, 100, 1000 najczęściej
występujących słów w tym pliku. 

####Ilość wszystkich słów:
```
db.slowa.count()
17005207
```
####Ilość różnych słów:
```
db.slowa.distinct("slowo").length
253854
```
####Ile procent stanowi 1, 10, 100, 1000 najczęstszych słów?
```
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 6.241594118789616
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 24.73339489486955
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 47.03840417820259
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 67.23443001899359
    }
  ],
  "ok" : 1
}
```

##Zadanie 1e
Wyszukać w sieci dane zawierające obiekty GeoJSON. Zapisać dane w bazie MongoDB.
Dla zapisanych danych przygotować 6–9 różnych Geospatial Queries
(co najmniej po jednym dla obiektów Point, LineString i Polygon).
W przykładach należy użyć każdego z tych operatorów: $geoWithin, $geoIntersect, $near.

Import danych do bazy:
```
mongoimport -c Miasta < polska.json
```
Przykłady
####1 (dla point, $near)

```
db.Miasta.find({loc: {$near: {$geometry: {type: "Point", coordinates: [21.000366210937496, 52.231163984032676]}, $maxDistance: 50000}}}).skip(1)
```
21.000366210937496, 52.231163984032676 - To współrzędne Warszawy.
Ta komenda pokazuje wszystkie najbliższe miasta w odległości maks 50km od Warszawy.
.skip(1) powoduje, że pierwsza wartość na liście nie zostanie wyświetlona, co jest logiczne ponieważ jest nią Warszawa.

####2 (Polygon, $geoWithin) - Mniej więcej województwo łódźkie:
```
db.Miasta.find({loc: {$geoWithin: {$geometry: {type: "Polygon", coordinates: [[[19.259033203125, 52.3923633970718], [18.1768798828125, 51.17589926990911], 
[19.7259521484375, 50.86144411058924], [20.5059814453125, 51.50532341149335], [20.23681640625, 52.1166256737882], [19.259033203125, 52.3923633970718]]]}}}})
```
####3 (LineString, $geoIntersects)
```
db.Miasta.find({loc: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [[19.010467529296875, -90],[19.010467529296875, 90]]}}}})
```
$geoIntersects sprawdza interakcje miedzy dwoma obiektami. Tutaj szuka tego, co leży na południku 19.010467529296875
(niestety nie działa tutaj przybliżenie, ani odległość od..., a miara musi być dokładna, żeby cokolwiek znalazł).

####4 ($geoIntersects)
```
db.Miasta.find({loc: {$geoIntersects: {$geometry: {type: "LineString", coordinates: [ [18.56586456298828, 54.4448910398684], [19.948768615722656, 49.29803885147804]]}}}})
```
Sprawdzamy czy coś leży w lini prostej pomiędzy Zakopanem, a Sopotem.
