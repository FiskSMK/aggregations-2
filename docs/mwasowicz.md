### *Michał Wąsowicz*

----

### Zadanie 1a

Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy MongoDB.
Wcześniej jednak należy przygotować plik Train.csv poleceniem:

```sh
cat Train.csv | replace "\n" " " | replace "\r" "\n" > Train2.csv
```

Import:

```sh
mongoimport --type csv -c Train --file Train2.csv --headerline
```


### Zadanie 1b
Zadanie 1b polega na zliczeniu zaimportowanych rekordów

```sh
db.train.count()
6 034 195
```

### Zadanie 1c

Zadanie 1c polega na zamianie formatu danych.
Należy zamienić string zawierający tagi na tablicę napisów z tagami, następnie zliczyć wszystkie tagi i wszystkie różne tagi.

Skrypt dla Mongo
```js
db.train.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.train.save(x);
}});
```




### Zadanie 1d
Zadanie 1d polega na zapisaniu słów w bazie MongoDB i zliczeniu: 
- liczby słów
- liczbę różnych słów
- Ile procent całego pliku stanowi najczęściej występujące słowo w tym pliku
- Ile procent całego pliku stanowi 10, 100, 1000 najczęściej występujących słów




### Zadanie 1e
Zadanie 1e polega na znalezieniu w sieci danych, zawierających obiekty GeoJSON. Należy zapisać te dane w bazie MongoDB.
Dla zapisanych danych przygotować 6–9 różnych Geospatial Queries (co najmniej po jednym dla obiektów Point, LineString i Polygon).
W przykładach należy użyć każdego z operatorów: $geoWithin, $geoIntersect, $near.
