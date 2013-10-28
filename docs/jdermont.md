### *Jacek Dermont*

----

### Zadanie 1a

Zaimportowałem bazę za pomocą:

```sh
time mongoimport --db baza --collection train < train.json
```

Wynik, który otrzymałem:

```
Mon Oct 21 09:14:48.402 check 9 6034195
Mon Oct 21 09:14:48.411 imported 6034195 objects

real    9m48.409s
user    4m29.307s
sys     0m22.567s
```

### Zadanie 1b

```js
db.train.count()
6034195
```

### Zadanie 1c

```js
db.train.distinct("Tags").length
42048
```

```json
{
  "result" : [
     {
        "_id" : "result",
        "count" : 17409994
     }
  ],
  "ok" : 1
}
```

### Zadanie 1d

```js
db.slowa.count()
17005207
```

```
> db.slowa.distinct("slowo").length
253854
```

```
1 słowo
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 6.241594118789616
                }
        ],
        "ok" : 1
}
10 słów
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 24.73339489486955
                }
        ],
        "ok" : 1
}
100 słów
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 47.03840417820259
                }
        ],
        "ok" : 1
}
1000 słów
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

#### Ciekawostki
```
Baza na HDD:
time mongoimport --db baza --collection slowa < text8.json
real    11m15.649s
user    2m8.957s
sys     0m21.070s

Baza na tmpfs (RAM):
time mongoimport --db baza --collection slowa < text8.json
real    8m11.272s
user    1m40.533s
sys     0m16.473s
```

```
HDD:
time echo 'db.slowa.ensureIndex({"slowo":1})' | mongo baza --quiet
real    3m48.409s
user    0m0.100s
sys     0m0.027s

tmpfs (RAM):
time echo 'db.slowa.ensureIndex({"slowo":1})' | mongo baza --quiet
real    1m47.142s
user    0m0.130s
sys     0m0.037s
```

Wyłączony journaling, kawałek tmpfs na swapie.

### e) To be continued
