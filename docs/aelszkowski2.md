### Zadanie2


Import do mongodb

```
mongoimport --db kody --collection kody --fields id,kod-pocztowy,poczta,wojewodztwo,ulica,powiat,numery,gmina --headerline --type csv --file kody.csv
```

Przykladowe agregacje


```
db.kody.aggregate({$group: {_id:"$poczta", suma_kodow:{$sum:1}} }, {$sort: {suma_kodow:-1} }, {$limit:10})
```

```
{
	"result" : [
		{
			"_id" : "szczecin",
			"suma_kodow" : 4157
		},
		{
			"_id" : "gdańsk",
			"suma_kodow" : 1829
		},
...
}
```

```
db.kody.aggregate({$group: {_id:"$powiat", suma_kodow:{$sum:1}} }, {$sort: {suma_kodow:-1} }, {$limit:10})
```

```
{
	"result" : [
		{
			"_id" : "m. st. warszawa",
			"suma_kodow" : 7793
		},
		{
			"_id" : "m. szczecin",
			"suma_kodow" : 4153
		},
...
}
```
Wykresy
[1](../images/aelszkowski/1.jpg)
[2](../images/aelszkowski/2.jpg)
