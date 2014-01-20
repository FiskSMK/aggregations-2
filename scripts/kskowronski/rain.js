var data = db.weather.aggregate({$group: { _id: {$substr: ["$date", 0, 7]}, totalrainfall: {$sum: "$rainfall"} }},{ $match: { totalrainfall: {$gt: 0}} }, {$sort: {_id: 1}}).result

function printCsvHeaders() {
  print("Month,Rainfall")
}

function printCsv(record) {
  var csv = record._id + "," + record.totalrainfall
  print(csv)
}
printCsvHeaders()
data.forEach(printCsv)
