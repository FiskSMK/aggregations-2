### *Jacek Dermont*

----

## Zadanie 1
### a)
Zaimportowałem bazę za pomocą:

```
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

### b)
```
> db.train.count()
6034195
```

### c)
```
> db.train.distinct("Tags").length
42048
```

```
> db.train.aggregate({$project:{"Tags":1}},{$unwind: "$Tags"},{$group:{"_id":"result",count:{$sum:1}}})
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

### d)
```
> db.slowa.count()
17005207
```

```
> db.slowa.distinct("slowo").length
253854
```

```
db.slowa.aggregate([{$group: {_id:"$slowo",total:{$sum:1}}},{$sort:{total:-1}},{$limit:1},{$group:{_id:"null",total_total:{$sum:"$total"}}},{$project:{_id:1,percent:{$divide:["$total_total",{$divide:[db.slowa.count(),100]}]}}}])
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 6.241594118789616
                }
        ],
        "ok" : 1
}
db.slowa.aggregate([{$group: {_id:"$slowo",total:{$sum:1}}},{$sort:{total:-1}},{$limit:10},{$group:{_id:"null",total_total:{$sum:"$total"}}},{$project:{_id:1,percent:{$divide:["$total_total",{$divide:[db.slowa.count(),100]}]}}}])
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 24.73339489486955
                }
        ],
        "ok" : 1
}
db.slowa.aggregate([{$group: {_id:"$slowo",total:{$sum:1}}},{$sort:{total:-1}},{$limit:100},{$group:{_id:"null",total_total:{$sum:"$total"}}},{$project:{_id:1,percent:{$divide:["$total_total",{$divide:[db.slowa.count(),100]}]}}}])
{
        "result" : [
                {
                        "_id" : "null",
                        "percent" : 47.03840417820259
                }
        ],
        "ok" : 1
}
db.slowa.aggregate([{$group: {_id:"$slowo",total:{$sum:1}}},{$sort:{total:-1}},{$limit:1000},{$group:{_id:"null",total_total:{$sum:"$total"}}},{$project:{_id:1,percent:{$divide:["$total_total",{$divide:[db.slowa.count(),100]}]}}}])
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

#### ciekawostki
```
Baza na HDD:
time mongoimport --db baza --collection slowa < text8.json
real    11m15.649s
user    2m8.957s
sys     0m21.070s

Baza na tmpfs (RAM)*:
time mongoimport --db baza --collection slowa < text8.json
real    8m11.272s
user    1m40.533s
sys     0m16.473s
```

```
HDD:
time echo 'db.slowa.ensureIndex({"slowo":1})' | mongo baza --quiet
real    1m47.142s
user    0m0.130s
sys     0m0.037s

tmpfs (RAM)*:
time echo 'db.slowa.ensureIndex({"slowo":1})' | mongo baza --quiet
real    3m48.409s
user    0m0.100s
sys     0m0.027s
```

* - wyłączony journaling; kawałek tmpfs był na swapie

### e) To be continued