var coll = db.imdb;

var result = coll.aggregate( 
	{ $match: { "modelName": "movies"} },
	{ $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
	{ $group: {_id: "$_id.dir" , count: {$sum: 1}} },
	{ $sort: {count: -1} },
	{ $limit: 10} );

print("directors: " + result.result.length);

printjson(result);