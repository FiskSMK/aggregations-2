### *Damian Matulewski*

----

### Zadanie 1a


Baze zaimporotwalem za pomoca

```sh

-mongoimport -d test -c train --type csv --file C:\Train_popr.csv --headerline

```

Czas importu wyniosl okolo 30 minut.

### Zadanie 1b

Dane zliczyłem za pomocą:

```js
db.train.count()
6034195
```
### Zadanie 1c

Zamiana stringa na tablicę tagów zajęła około 90 minut.

[Skrypt przerabiający stringi na tagi + zliczanie ilości tagów.](docs/dmatulewski/dmatulewski_Zad1c.php)

Ilośc wszystkich tagów: 17409994

Ilość różnych tagów:
```js
db.train.distinct("Tags").length
42048
```

### Zadanie 1d

Ilość wszystkich słów:

```js
db.word.count()
17005207
```

Ilość różnych słów:
```js

db.word.distinct("word").length
253854
```

Ile procent stanowi 1, 10, 100, 1000 najczęstszych słów?
```json
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 6.241594155789616
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 24.73348489486955
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 47.038404485320259
    }
  ],
  "ok" : 1
}
{
  "result" : [
    {
      "_id" : "null",
      "percent" : 67.23792001899359
    }
  ],
  "ok" : 1
}
```
