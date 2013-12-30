// run: mongo imdb agg2.js

var coll = db.imdb;

var result = coll.aggregate(
  { $match: { "modelName": "movies" || "tv_shows"  } },
  { $group: {_id: "$title", count: {$sum: 1} } },
  { $sort: {count: -1} },
  { $limit: 10}
);

printjson(result);
