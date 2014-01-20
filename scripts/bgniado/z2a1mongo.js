// run: mongo imdb agg1.js

var coll = db.glue;

var result = coll.aggregate(
	{ $group: {_id: "$userId", count: {$sum: 1}} },
	{ $sort: {count: -1} }
);

print("Users: " + result.result.length);

printjson(result);
