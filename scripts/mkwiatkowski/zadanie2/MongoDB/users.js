var coll = db.imdb;

var result = coll.aggregate(
	{ $match: { "modelName": "movies" || "tv_shows", "action": "Liked"}},
	{ $group: {_id: "$userId", count: {$sum: 1}} },
	{ $sort: {count: -1} },
	{ $limit: 10}
);

print("number of users who liked something: " + result.result.length);

printjson(result);
