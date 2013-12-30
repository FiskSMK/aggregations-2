### *Michał Dępczyk*

----

MongoDB shell version: 2.4.7

### Zadanie 2

Baza: [Broadband coverage](http://data.gov.uk/dataset/broadband-coverage)

##Mongodb

#Import

```
time mongoimport --type csv -c broadband --file Postcode.csv --headerline
```

Sun Dec 22 21:48:17.078 check 9 1899574
Sun Dec 22 21:48:17.178 imported 1899573 objects

real	1m6.203s
user	0m14.413s
sys	0m1.228s

##Agregacja 1
```
db.broadband.aggregate({$group:{_id:"$Postcode Data Status",total:{$sum: 1}}},{$sort:{total:-1}},{$limit:10})
```
#Wynik:
```
{
	"result" : [
		{
			"_id" : "OK",
			"total" : 1311130
		},
		{
			"_id" : "No Data",
			"total" : 183585
		},
		{
			"_id" : "Insufficient Premises",
			"total" : 162613
		},
		{
			"_id" : "No premises",
			"total" : 137197
		},
		{
			"_id" : "Insufficient Data",
			"total" : 105048
		}
	],
	"ok" : 1
}
```
#Wykres:
![broadband](../images/mdepczyk/ag1.png)

##Agregacja 2
```
db.broadband.aggregate(
  { $match: { "Postcode Data Status": "OK" } },
  { $group: {_id: "$Average Speed/Mbps", count: {$sum: 1} } },
  { $sort: {count: -1} },
  { $limit: 10}
);
```
#Wynik:
```
{
	"result" : [
		{
			"_id" : ">=30",
			"count" : 135677
		},
		{
			"_id" : 6.9,
			"count" : 6357
		},
		{
			"_id" : 7.1,
			"count" : 6287
		},
		{
			"_id" : 7,
			"count" : 6024
		},
		{
			"_id" : 6.8,
			"count" : 6023
		},
		{
			"_id" : 6.7,
			"count" : 5948
		},
		{
			"_id" : 7.2,
			"count" : 5881
		},
		{
			"_id" : 7.3,
			"count" : 5861
		},
		{
			"_id" : 8.1,
			"count" : 5826
		},
		{
			"_id" : 6.6,
			"count" : 5800
		}
	],
	"ok" : 1
}
```
#Wykres:
![broadband](../images/mdepczyk/ag2.png)
