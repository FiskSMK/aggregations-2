### Zadanie 2

#### Dane
[GetGlue and Timestamped Event Data](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) (ok. `11 GB`, `19 831 300` json-ów, próbka 100 jsonów [getglue101](https://github.com/nosql/aggregations-2/blob/master/data/wbzyl/getglue101.json)). Są to dane z [IMDB](http://www.imdb.com/) z lat 2007–2012, tylko filmy i przedstawienia TV. 

Przykładowy dokument `json`:

```json
{
 "_id" : ObjectId("52dbfe025c2e6553d92e24d3")
 "comment" : ""
 "hideVisits" : "false"
 "modelName" : "tv_shows"
 "displayName" : "Samantha"
 "title" : "The Walking Dead"
 "timestamp" : "2010-09-13T00:46:35Z"
 "image" : "http://www.millionaireplayboy.com/mpb/wp-content/uploads/2010/07/StruzanWalkingDead-thumb-550x815-43429.jpeg"
 "userId" : "AuroraImages"
 "private" : "false"
 "source" : "http://www.imdb.com/title/tt1520211"
 "version" : "2"
 "link" : "http://www.imdb.com/title/tt1520211"
 "lastModified" : "2011-12-16T21:39:06Z"
 "action" : "Liked"
 "lctitle" : "the walking dead"
 "objectKey" : "tv_shows/walking_dead"
 "visitCount" : "1"
 "app" : "GetGlue"
 }
```

#### Import

```sh
time mongoimport -d imdb -c imdb --type json --file getglue_sample.json
```

#### Czas importu
```sh
Sun Jan 19 17:57:39.716 imported 19831300 objects
real	26m4.099s
```

### Agregacje

#### Agregacja 1

##### 10 reżyserów z największą ilością filmów
```json
db.imdb.aggregate( 
    { $match: { "modelName": "movies"} },
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit: 10} 
    );
```

##### Wynik
```json
{
	"result" : [
		{
			"_id" : "not available",
			"count" : 1474
		},
		{
			"_id" : "various directors",
			"count" : 54
		},
		{
			"_id" : "alfred hitchcock",
			"count" : 50
		},
		{
			"_id" : "michael curtiz",
			"count" : 48
		},
		{
			"_id" : "woody allen",
			"count" : 47
		},
		{
			"_id" : "takashi miike",
			"count" : 43
		},
		{
			"_id" : "jesus franco",
			"count" : 43
		},
		{
			"_id" : "ingmar bergman",
			"count" : 42
		},
		{
			"_id" : "john ford",
			"count" : 42
		},
		{
			"_id" : "steven spielberg",
			"count" : 41
		}
	],
	"ok" : 1
}
```

#### Agregacja 2

##### 10 użytkowników z największą ilością wpisów
```json
db.imdb.aggregate({$group:{_id: "$userId", count:{$sum: 1}}},{$sort:{count: -1}},{$limit: 10});
```

##### Wynik
```json
{
	"result" : [
		{
			"_id" : "LukeWilliamss",
			"count" : 696782
		},
		{
			"_id" : "demi_konti",
			"count" : 68137
		},
		{
			"_id" : "bangwid",
			"count" : 59261
		},
		{
			"_id" : "zenofmac",
			"count" : 56233
		},
		{
			"_id" : "agentdunham",
			"count" : 55740
		},
		{
			"_id" : "cillax",
			"count" : 43161
		},
		{
			"_id" : "tamtomo",
			"count" : 42378
		},
		{
			"_id" : "hblackwood",
			"count" : 32832
		},
		{
			"_id" : "ellen_turner",
			"count" : 32239
		},
		{
			"_id" : "husainholic",
			"count" : 32135
		}
	],
	"ok" : 1
}
```