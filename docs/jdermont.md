### *Jacek Dermont*

----

## Zadanie 1
### a)
Zaimportowałem bazę za pomocą:

```time mongoimport --db baza --collection train < train.json
```

Wynik, który otrzymałem:
```Mon Oct 21 09:14:48.402 check 9 6034195
Mon Oct 21 09:14:48.411 imported 6034195 objects

real    9m48.409s
user    4m29.307s
sys     0m22.567s
```

### b)
```> db.train.count()
6034195
```

### c)
```> db.train.distinct("Tags").length
42048
```

```> db.train.aggregate({$project:{"Tags":1}},{$unwind: "$Tags"},{$group:{"_id":"result",count:{$sum:1}}})
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

### To be continued