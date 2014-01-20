##Aleksandra Piasecka

##Zadanie 2
Dane wygenerowane na stronie: http://www.json-generator.com/

#MongoDB

Import do bazy:
```
mongoimport -c data < data.json
```

Przykładowy wpis:
```
{
	"_id" : ObjectId("52dc04c94c312065e0f5ab7c"),
	"guid" : "73758b39-44bf-47fe-b8f4-8eb42ac0f75d",
	"isActive" : false,
	"age" : 63,
	"name" : "ShermanHuffman",
	"gender" : "male",
	"company" : "Talendula",
	"email" : "shermanhuffman@talendula.com",
	"city" : "Jugtown",
	"sport" : "jogging"
}
```

Ilość rekordów:
```
db.data.count();
322002
```

###Agregacja
5 najczęściej występujących sportów:
```
db.data.aggregate(	{$group: {_id: "$sport", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 5})
```
Wynik:
```
{
        "result" : [
                {
                        "_id" : "diving",
                        "count" : 16303
                },
                {
                        "_id" : "dancing",
                        "count" : 16296
                },
                {
                        "_id" : "skijumping",
                        "count" : 16254
                },
                {
                        "_id" : "judo",
                        "count" : 16240
                },
                {
                        "_id" : "volleyball",
                        "count" : 16237
                }
        ],
        "ok" : 1
}
```
![Chart1](../images/chart0.png)

Ilość wszystkich sportów:
```
db.data.aggregate(	{$group: {_id: "$sport", count: {$sum: 1}}}, 
					{$group: {_id: null, count: {$sum: 1}}})
```

Wynik:
```
{ "result" : [ { "_id" : null, "count" : 20 } ], "ok" : 1 }
```


###Agregacja
Sporty które uprawiają mężczyźni

```
db.data.aggregate(	{$match : {gender: "male" }},
					{$group: {_id: "$sport", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 20})
```

Wynik:
```
{
        "result" : [
                {
                        "_id" : "dancing",
                        "count" : 8284
                },
                {
                        "_id" : "diving",
                        "count" : 8240
                },
                {
                        "_id" : "jogging",
                        "count" : 8146
                },
                {
                        "_id" : "cycling",
                        "count" : 8129
                },
                {
                        "_id" : "volleyball",
                        "count" : 8122
                },
                {
                        "_id" : "tennis",
                        "count" : 8084
                },
                {
                        "_id" : "aerobics",
                        "count" : 8054
                },
                {
                        "_id" : "skijumping",
                        "count" : 8044
                },
                {
                        "_id" : "boxing",
                        "count" : 8042
                },
                {
                        "_id" : "handball",
                        "count" : 8032
                },
				{
                        "_id" : "judo",
                        "count" : 8030
                },
                {
                        "_id" : "tabletennis",
                        "count" : 8015
                },
                {
                        "_id" : "surfing",
                        "count" : 8010
                },
                {
                        "_id" : "windsurfing",
                        "count" : 7999
                },
                {
                        "_id" : "sailing",
                        "count" : 7945
                },
                {
                        "_id" : "basketball",
                        "count" : 7937
                },
                {
                        "_id" : "climbing",
                        "count" : 7919
                },
                {
                        "_id" : "darts",
                        "count" : 7899
                },
                {
                        "_id" : "fishing",
                        "count" : 7853
                },
                {
                        "_id" : "skateboarding",
                        "count" : 7833
                }
        ],
        "ok" : 1
}
```	
				
Sportówm które uprawiają kobiety
```		
db.data.aggregate(	{$match : {gender: "female" }},
					{$group: {_id: "$sport", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 20})
```	
				
Wynik:
```
{
        "result" : [
                {
                        "_id" : "judo",
                        "count" : 8210
                },
                {
                        "_id" : "skijumping",
                        "count" : 8210
                },
                {
                        "_id" : "sailing",
                        "count" : 8196
                },
                {
                        "_id" : "basketball",
                        "count" : 8140
                },
                {
                        "_id" : "skateboarding",
                        "count" : 8130
                },
                {
                        "_id" : "volleyball",
                        "count" : 8115
                },
                {
                        "_id" : "darts",
                        "count" : 8091
                },
                {
                        "_id" : "cycling",
                        "count" : 8085
                },
                {
                        "_id" : "diving",
                        "count" : 8063
                },
                {
                        "_id" : "fishing",
                        "count" : 8062
                },
				{
                        "_id" : "jogging",
                        "count" : 8059
                },
                {
                        "_id" : "handball",
                        "count" : 8058
                },
                {
                        "_id" : "aerobics",
                        "count" : 8050
                },
                {
                        "_id" : "climbing",
                        "count" : 8036
                },
                {
                        "_id" : "dancing",
                        "count" : 8012
                },
                {
                        "_id" : "windsurfing",
                        "count" : 8007
                },
                {
                        "_id" : "boxing",
                        "count" : 8004
                },
                {
                        "_id" : "surfing",
                        "count" : 7971
                },
                {
                        "_id" : "tennis",
                        "count" : 7955
                },
                {
                        "_id" : "tabletennis",
                        "count" : 7931
                }
        ],
        "ok" : 1
}
```
![Chart2](../images/chart1.png)


