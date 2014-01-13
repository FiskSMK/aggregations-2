
// db.so.aggregate([ 
//   { $limit:20 }, 
//   { $project: {_id:0, tags:1} }, 
//   { $unwind: "$tags"}, 
//   { $group: {_id: "$tags", count: {$sum: 1}}}
// ]);

var wc = db.so.aggregate([ 
  { $project: {_id: 0, tags: 1} }, 
  { $unwind: "$tags" }, 
  { $group: {_id: "$tags", count: {$sum: 1}} }
]);

wc.result.length;

var cmp = function(a, b) { return b.count - a.count; }

var sresults = wc.result.sort(cmp);

sresults[0];
