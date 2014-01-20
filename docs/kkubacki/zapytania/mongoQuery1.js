var query = get_results(db.train.aggregate(
  { $group: {_id: "$type", count: {$sum: 1}} },
  { $sort: {count: -1} }
)
);

function get_results (result) {
    print(tojson(result));
}

