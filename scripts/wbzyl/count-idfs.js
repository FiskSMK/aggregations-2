
// db.so.aggregate([ 
//   { $limit:20 }, 
//   { $project: {_id:0, tags:1} }, 
//   { $unwind: "$tags"}, 
//   { $group: {_id: "$tags", count: {$sum: 1}}}
// ]);

var idf = db.so.aggregate([ 
  { $project: {_id: 0, words: 1} }, 
  { $unwind: "$words" }, 
  { $group: {_id: "$words", count: {$sum: 1}} }
], { allowDiskUsage: true });

// var cmp = function(a, b) { return b.count - a.count; }

// var sresults = wc.result.sort(cmp);

// sresults[0];
