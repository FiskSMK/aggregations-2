### *Konrad Wiśniewski*

----

### Zadanie 1a

Zadanie 1a polega na zaimportowaniu, do systemów baz danych uruchomionych na swoim komputerze, danych z pliku Train.csv bazy MongoDB.
Wcześniej jednak należy odpowiednio przystosować plik Train.csv poleceniem:

```sh
cat Train.csv | replace "\n" " " | replace "\r" "\n" > Trainn.csv
```

Import:

```sh
mongoimport --type csv -c Train --file Train2.csv --headerline
```


### Zadanie 1b
Zliczanie zaimportowanych rekordów.

```sh
db.train.count()
6 034 195
```

### Zadanie 1c

Należy zamienić string zawierający tagi na tablicę napisów z tagami, następnie zliczyć wszystkie tagi i wszystkie różne tagi.

Skrypt
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

Import pliku

```sh
mongoimport --type csv -f word -d text8 -c text8 --file text8.txt
```

Zliczanie słów
```sh
  db.text8.count()

  Rezultat: 17005207
```

Zliczanie różnych słów
```sh
 db.text8.distinct("word").length

  Rezultat: 253854
```
