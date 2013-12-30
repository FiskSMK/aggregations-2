# *Przemysław Królik*

----

## Zadanie 2

Wykorzystałem bazę danych udostępnioną przez [GetGlue](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) umieszczoną na stronie [dr Włodzimierza Bzyla](http://wbzyl.inf.ug.edu.pl/nosql/).
Procesy importu danych pomijam jednakże warto zauważyć, że mongo importuje poprawnie ilość danych 
```js 
imported 19831300 objects
```
jednakże ElasticSearch ma problem z importem niektórych rekordów 
```js
{
    "count": 19766542,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    }
}
```

## MongoDB

####Agregacja 1: 20 najczęściej występujących reżyserów

```js
db.imdb.aggregate({$group:{_id: "$director", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 20});
{
	"result" : [
		{
			"_id" : null,
			"count" : 12235144
		},
		{
			"_id" : "steven spielberg",
			"count" : 108571
		},
		{
			"_id" : "tim burton",
			"count" : 101741
		},
		{
			"_id" : "bill condon",
			"count" : 97835
		},
		{
			"_id" : "gary ross",
			"count" : 82420
		},
		{
			"_id" : "david yates",
			"count" : 77366
		},
		{
			"_id" : "james cameron",
			"count" : 74645
		},
		{
			"_id" : "joss whedon",
			"count" : 72810
		},
		{
			"_id" : "christopher nolan",
			"count" : 68542
		},
		{
			"_id" : "robert zemeckis",
			"count" : 67181
		},
		{
			"_id" : "david fincher",
			"count" : 59427
		},
		{
			"_id" : "jon favreau",
			"count" : 56669
		},
		{
			"_id" : "quentin tarantino",
			"count" : 55616
		},
		{
			"_id" : "martin scorsese",
			"count" : 54845
		},
		{
			"_id" : "peter jackson",
			"count" : 51708
		},
		{
			"_id" : "todd phillips",
			"count" : 50534
		},
		{
			"_id" : "john lasseter",
			"count" : 49340
		},
		{
			"_id" : "gore verbinski",
			"count" : 47979
		},
		{
			"_id" : "chris columbus",
			"count" : 44403
		},
		{
			"_id" : "michael bay",
			"count" : 42845
		}
	],
	"ok" : 1
}
```
Oczywiście pan "null" nie był reżyserem jednakże oznacza to, że tyle wpisów nie miało jakkolwiek podanego reżysera (w prezentacji graficznej jest on pominięty).
![mms1d](../../images/pkrolik/mms1d.png)