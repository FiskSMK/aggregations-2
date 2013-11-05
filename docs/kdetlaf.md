### *Detlaf Krzysztof*
----
###Parametry komputera:

####Intel Core i3-2310M @ 2.10 GHz, 4 GB RAM

Wersja mongo
```
$ mongo --version
MongoDB shell version: 2.4.8
```
Do mierzenia czasu w systemie windows użyłem [timer.cmd](https://github.com/kdetlaf/mongoFiles/blob/master/timer.cmd).

----

### Zadanie 1A

Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy MongoDB.
Wcześniej jednak plik Train.csv przygotowałem za pomocą [2unix.bash](https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh).

Import przygotowanego pliku do bazy:

```sh
mongoimport --type csv -c Train --file C:\Users\Krzysztof\Desktop\noSQL\Train2.csv --headerline
```
Czas ok. 1h 05 min

### Zadanie 1B
Zadanie 1b polega na zliczeniu zaimportowanych rekordów

```sh
db.train.count()
6 034 195
```

### Zadanie 1C

Zadanie 1c polega na zamianie formatu danych.
Należy zamienić string zawierający tagi na tablicę napisów z tagami, następnie zliczyć wszystkie tagi i wszystkie różne tagi.
Użyłem tutaj prostego skryptu dla mongo :

```
db.train.find( { "tags" : { $type : 2 } } ).snapshot().forEach(
 function (x) {
  if (!Array.isArray(x.tags)){
    x.tags = x.tags.split(' ');
    db.train.save(x);
}});
```

### Zadanie 1D
Zadanie 1d polega na zapisaniu słów w bazie MongoDB i zliczeniu: 
- liczby słów
- liczbę różnych słów
- Ile procent całego pliku stanowi najczęściej występujące słowo w tym pliku
- Ile procent całego pliku stanowi 10, 100, 1000 najczęściej występujących słów

Import pliku

```sh
mongoimport --type csv -f word -d text8 -c text8 --file text8.txt
```

Czas to ok. 34 minuty


**10, 100, 100 najczestszych słów**
 
Top 1:
Ilość:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 1 }, 
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```

Top 10:
Ilość:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 10 }, 
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```

Top 100:
Ilość:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 100 },
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```

Top 1000:
Ilość:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 1000 },
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```

Procentowy wykaz
-------------

<table>
  <tr>
    <th>Ilość</th><th>Suma</th><th>Udział procentowy</th>
  </tr>
  <tr>
    <td>1</td><td>1061396</td><td>6,25%</td>
  </tr>
  <tr>
    <td>10</td><td>4205965</td><td>24,73%</td>
  </tr>
 <tr>
    <td>100</td><td>7998978</td><td>47,03%</td>
  </tr>
 <tr>
    <td>1000</td><td>11433354</td><td>67,23%</td>
  </tr>
</table>

Ilosc wszystkich slow

```
> db.text.count()
17005207
```

Ilosc roznych slow

```
> db.text.distinct("word").length
253854
```

### Zadanie 1E
Zadanie 1e polega na znalezieniu w sieci danych, zawierających obiekty GeoJSON. Należy zapisać te dane w bazie MongoDB.
Dla zapisanych danych przygotować 6–9 różnych Geospatial Queries (co najmniej po jednym dla obiektów Point, LineString i Polygon).
W przykładach należy użyć każdego z operatorów: $geoWithin, $geoIntersect, $near.
