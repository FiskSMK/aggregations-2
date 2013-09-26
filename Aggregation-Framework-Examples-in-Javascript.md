## Aggregation Framework Examples (MongoDB, Javascript)

This document provides a number of practical examples that display the
capabilities of the aggregation framework.

The [_Aggregations using the Zip Codes Data Set_](http://docs.mongodb.org/manual/tutorial/aggregation-examples/#aggregations-using-the-zip-code-data-set)
examples uses a publicly available data set of all zipcodes and
populations in the United States. These data are available at:
[zips.json](http://media.mongodb.org/zips.json).


## Requirements

* [MongoDB](http://www.mongodb.org/downloads), version 2.4.1 or later.

Use the following command to load *zips.json* data set into
**your** *mongod* instance:

```sh
mongoimport --drop -d test -c zipcodes zips.json
```

or use the *zipcodes* collection from here:

```sh
mongo --username student --password sesja2013 153.19.1.202/test
```

**Note:** The *student* user is given only the **read** privileges
in the *test* database.


## Aggregations using the Zip Codes Data Set

Each document in this collection has the following form:

```json
{
  "_id" : "35004",
  "city" : "Acmar",
  "state" : "AL",
  "pop" : 6055,
  "loc" : [-86.51557, 33.584132]
}
```

In these documents:

* The `_id` field holds the zipcode as a string.
* The `city` field holds the city name.
* The `state` field holds the two letter state abbreviation.
* The `pop` field holds the population.
* The `loc` field holds the location as a `[latitude, longitude]` array.


### States with Populations Over 10 Million

To get all states with a population greater than 10 million, use
the following aggregation pipeline:

```js
coll = db.zipcodes

coll.aggregate(
  { $group: {_id: "$state", totalPop: {$sum: "$pop"}} },
  { $match: {totalPop: {$gte: 10000000}} }
)
```
The result:

```json
{
  "result": [
    { "_id": "PA", "totalPop": 11881643 },
    { "_id": "OH", "totalPop": 10847115 },
    { "_id": "NY", "totalPop": 17990455 },
    { "_id": "TX", "totalPop": 16986510 },
    { "_id": "FL", "totalPop": 12937926 },
    { "_id": "IL", "totalPop": 11430602 },
    { "_id": "CA", "totalPop": 29760021 }
  ],
  "ok": 1
}
```

The above aggregation pipeline is build from two pipeline operators:
`$group` and `$match`.

The `$group` pipeline operator requires `_id` field where we specify
grouping; remaining fields specify how to generate composite value and
must use one of
[the group aggregation functions](http://docs.mongodb.org/manual/reference/aggregation/#group-operators):
`$addToSet`, `$first`, `$last`, `$max`, `$min`, `$avg`, `$push`, `$sum`.
The `$match` pipeline operator syntax is the same as
the [read operation](http://docs.mongodb.org/manual/core/read-operations/)
query syntax.

The `$group` process reads all documents and for each state it
creates a separate document, for example:

```ruby
{
   "_id": "CA",
   "totalPop": 29760021
}
```

The `totalPop` field uses the `$sum` aggregation function
to sum the values of all `pop` fields in the source documents.

Documents created by `$group` are piped to the `$match` pipeline
operator. It returns the documents with the value of `totalPop` field
greater than or equal to 10 million.


### Average City Population by State

To get the first three states with the greatest average population
per city, use the following aggregation:

```js
coll.aggregate(
  { $group: {_id: {state: "$state", city: "$city"}, pop: {$sum: "$pop"}} },
  { $group: {_id: "$_id.state", avgCityPop: {$avg: "$pop"} } },
  { $sort: {avgCityPop: -1} },
  { $limit: 3 }
)
```

This aggregate pipeline produces:

```json
{
  "result": [
    { "_id": "DC", "avgCityPop": 303450 },
    { "_id": "CA", "avgCityPop": 27581.113067655235 },
    { "_id": "FL", "avgCityPop": 26676.136082474226 }
  ],
  "ok": 1
}
```

The above aggregation pipeline is build from three pipeline operators:
`$group`, `$sort` and `$limit`.

The first `$group` operator creates the following documents:

```json
{
  "_id": {
    "state": "AZ",
    "city": "GOODYEAR"
  },
  "pop": 5819
}
```

Note, that the `$group` operator can’t use nested documents
except the `_id` field.

The second `$group` uses these documents to create the following
documents:

```json
{
  "_id": "WY",
  "avgCityPop": 3359.911111111111
}
```

These documents are sorted by the `avgCityPop` field in descending order.
Finally, the `$limit` pipeline operator returns the first 3 documents
from the sorted set.


### Largest and Smallest Cities by State

To get the smallest and largest cities by population for each
state, use the following aggregate pipeline:

```js
coll.aggregate(
  { $group: {_id: {state: "$state", city: "$city"}, pop: {$sum: "$pop"}} },
  { $sort: {pop: 1} },
  {
    $group: {
      _id: "$_id.state",
      smallestCity: {$first: "$_id.city"},
      smallestPop:  {$first: "$pop"},
      biggestCity:  {$last:  "$_id.city"},
      biggestPop:   {$last:  "$pop"}
    }
  }
)
```

The first `$group` operator creates a new document for every
combination of the `state` and `city` fields from the source
documents. Each document created at this stage has the field `pop`
which is set to the value computed by the `$sum` operator.
It sums the values of the `pop` field in the grouped documents.

The sample document created at this stage looks like:

```json
{
  "_id": {
    "state": "AZ",
    "city": "GOODYEAR"
  },
  "pop": 5819
}
```

*Note*: To preserve the values of the `state` and `city` fields
for later use in the pipeline we specify the value of `_id`
as a nested document which contains both values.

The second `$group` operator groups the documents by the value of
`_id.state`.

The sorting order is preserved within grouped documents.
So, `$first` operators return name of the city with
the smallest population and the city population.
The `$last` operators return the city name with the
biggest population and the city population.

The sample document created at this stage looks like:

```json
{
  "_id": "CA",
  "smallestCity": "OREGON HOUSE",
  "smallestPop": 0,
  "biggestCity": "LOS ANGELES",
  "biggestPop": 2102295
}
```

## Unwinding data in the Name Days Data Set

To run the examples below you need this data set:
[name_days.json](https://raw.github.com/wiki/mongodb/mongo-ruby-driver/data/name_days.json).

Use *mongoimport* to import this data set into MongoDB:

```sh
mongoimport --drop --db test --collection cal name_days.json
```

or use the *cal* collection from here:

```sh
mongo --username student --password sesja2013 153.19.1.202/test
```

The collection *cal*  should contain 364 documents
in the following format:

```json
{
  "_id": ObjectId("51643484c20a89f0145ac8e8"),
  "names": [
    "Mieszka", "Mieczysława", "Marii" ],
  "date": {
    "day": 1, "month": 1
  }
}
```

### The 6 most common name days

The following aggregation pipeline computes this:

```js
coll = db.cal  // switch collection

coll.aggregate(
  { $project: {names: 1, _id: 0} },
  { $unwind: "$names" },
  { $group: {_id: "$names", count: {$sum: 1}} },
  { $sort: {count: -1} },
  { $limit: 6 }
)
```

The sample document created by the `$project` pipeline operator
looks like:

```json
{ "names": [ "Sylwestra", "Melanii", "Mariusza" ] }
```

The `$unwind` operator creates one document for every member of
*names* array. For example, the above document is unwinded into three
documents:

```json
{ "names": "Sylwestra" }
{ "names": "Melanii"   }
{ "names": "Mariusza"  }
```

These documents are grouped by the `names` field and the documents
in each group are counted by the `$sum` operator.

The sample document created at this stage looks like:

```json
{ "_id": "Julii", "count": 3 }
```

Finally, the `$sort` operator sorts these documents by the
`count` field in descending order, and  the `$limit` operator
outputs the first 6 documents:

```json
{
  "result": [
    { "_id": "Jana",      "count": 21 },
    { "_id": "Marii",     "count": 16 },
    { "_id": "Grzegorza", "count":  9 },
    { "_id": "Piotra",    "count":  9 },
    { "_id": "Feliksa",   "count":  8 },
    { "_id": "Leona",     "count":  8 }
  ],
  "ok": 1
}
```

### Pivot date ↺ names

We want to pivot the *name_days.json* data set.
Precisely, we want to convert documents from this format:

```json
{
   "date": { "day": 1, "month": 1 }
   "names": [ "Mieszka", "Mieczysława", "Marii" ],
}
```

into this format:

```json
{
   "name": "Mateusza",
   "dates": [{"day": 13, "month": 11}, {"day": 21, "month": 9}]
}
```

The following aggregation pipeline does the trick:

```js
coll.aggregate(
  { $project: {_id: 0, date: 1, names: 1} },
  { $unwind: "$names" },
  { $group: {_id: "$names", dates: {$addToSet: "$date"}} },
  { $project: {name: "$_id", dates: 1, _id: 0} },
  { $sort: {name: 1} }
)
```

The sample document created by the unwinding stage looks like:

```json
{
   "names": "Eugeniusza",
   "date": { "day": 30, "month": 12 }
}
```

The `$group` pipeline operator groups these documents by the `names`
field. The `$addToSet` operator returns an array of all unique values
of the `date` field found in the set of grouped documents.
The sample document created at this stage of the pipeline looks like:

```json
{
   "_id": "Maksymiliana",
   "dates": [{"day": 12, "month": 10}, {"day": 14, "month": 8}]
}
```

In the last two stages we sort and reshape these documents to the
requested format:

```json
{
   "name": "Zuzanny",
   "dates": [{"day": 11, "month": 8}, { "day": 24, "month": 5}]
}
```


## Quiz

1\. For the *zipcodes* collection, the aggregation below computes
`248_706_415`. What does this number mean?


```js
coll.aggregate({ $group: {_id: 0, sum: {$sum: "$pop"}} })
// {
//   "result": [
//     {
//       "_id": 0,
//       "sum": 248706415
//     }
//   ],
//   "ok": 1
// }
```

2\. How many different names are in the *cal* collection?
