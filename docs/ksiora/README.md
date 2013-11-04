## Specyfikacja techniczna
```
Intel i5-430M 2,26 GHz 4 rdzenie
4 GB RAM
MongoDB shell version: 2.4.8
```
Do mierzenia czasu użyłem pliku wsadowego [timer.cmd](https://github.com/nosql/aggregations-2/blob/master/scripts/ksiora/timer.cmd).

## 1a
Do przygotowania pliku train.csv użyłem skrtyptu [2unix.bash](https://github.com/nosql/aggregations-2/blob/master/scripts/wbzyl/2unix.sh).

![img](http://i39.tinypic.com/2qa4ok7.png)

Czas trwania 31m 46s.

Importowanie danych:

![img](http://i39.tinypic.com/2hcdgzp.png)
![img](http://i43.tinypic.com/2l6q95.png)

Czas trwania 57m 46s.

## 1b
```
db.zadanie.count();
```
Rezultat:
```
6034195
```

## 1c
Użyłem skryptu [convert.js](https://github.com/nosql/aggregations-2/blob/master/scripts/ksiora/convert.js).

![img](http://i42.tinypic.com/mc9dox.png)

Czas trwania 35m 45s.

## 1d
Importowanie:

![img](http://i39.tinypic.com/21ayfxw.png)
![img](http://i41.tinypic.com/2j4zdw0.png)

Czas trwania 28m 14s.

Całkowita liczba słów oraz liczba różnych słów:

![img](http://i44.tinypic.com/3162gdv.png)

Najczęściej występujące słowa:
```js
db.text.aggregate(
    [
      { $group : { _id : "$word" , number : { $sum : 1 } } },
      { $sort : { number : -1 } },
      { $limit : 1 }, //10, 100, 1000
	  { $group : { _id : "słowa", ilosc: { $sum : "$number" } } } 
    ]
  )
```
Najczęściej występujące słowo pojawia się 1061396 razy, co stanowi 6.24 %.

10 najczęściej występujących słów pojawia się łącznie 4205965 razy, co stanowi 24.73 %.

100 najczęściej występujących słów pojawia się łącznie 7998978 razy, co stanowi 47.04 %.

1000 najczęściej występujących słów pojawia się łącznie 11433354 razy, co stanowi 67,23 %.