#### Oskar Duwe

----

### *Konfiguracja sprzętu*

**Procesor:** Intel i5-4670K (3,4GHz na rdzeń)<br>
**Dysk twardy:** Seagate Barracuda ST1000DM003 1TB 7200 RPM 64MB Cache SATA 6.0Gb/s<br>
**RAM:** DDR3 2x8GB 1333MHz CL9<br>
**System operacyjny:** Archlinux x86_64


## Zadanie 1
### a)
Plik wymagał modyfikacji przed importem z powodu innego łamania lini. Skorzystałem ze skryptu "2unix.sh". Następnie wykonałem import:
```
$ time mongoimport --type csv -c Train --file ./Train.csv --headerline
```
Import zajął 3 minuty i 48 sekund:

    real    3m48.020s
    user    0m38.152s
    sys     0m2.705s

### b)
Dokonałem zliczenia liczby zaimportowanych rekordów:

```
$ mongo
> db.Train.count()
6034195
```
Zgodnie z liczbą rekordów w pliku wyniosła ona 6034195.

### c)
Skorzystałem z następującego skryptu do konwersji tagów na tablicę tagów:
```
db.Train.find ( { "tags" : { $type : 2 } } ).snapshot().forEach(
    function (x) {
        if (!Array.isArray(x.tags)) {
            x.tags = x.tags.split(' ');
            db.train.save(x);
        }
    }
);
```

### d)

Po uprzednim przygotowaniu pliku zgodnie z opisem w poleceniu zaimportowałem plik poprzez:
```
time mongoimport --type csv -f word -c text8 --file ./text8.txt
```
Import zajął 2 minuty i 19 sekund.

```
real    2m19.556s
user    0m12.930s
sys     0m2.486s
```

Ilość słów w zaimportowanej bazie wyniosła 17005207:
```
[einstein@Enkelados Zadanie 1]$ mongo
MongoDB shell version: 2.4.7
connecting to: test
> db.text8.count()
17005207
```

Różnych słów w bazie jest 253854:

```
> db.text8.distinct("word").length
253854
```

Najczęściej występujące słowo:
```
> db.text8.aggregate([ {$group:{ _id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1} ])
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }

```

10 najczęstszych słów:
```
> db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:10}, {$group:{_id: null, count:{$sum:"$count"}}} ])
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }

```

100 najczęstszych słów:
```
> db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:100}, {$group:{_id: null, count:{$sum:"$count"}}} ])
{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }
```

1000 najczęstszych słów:
```
db.text8.aggregate([ {$group:{_id:"$word", count:{$sum:1}}}, {$sort: {count: -1}}, {$limit:1000}, {$group:{_id: null, count:{$sum:"$count"}}} ])
{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }
```

**Więc:**

    Najczęstsze słowo: 6% całości
    10 najczęstszych słów: 25% całości
    100 najczęstszych słów: 47% całości
    1000 najczęstszych słów: 67% całości 
