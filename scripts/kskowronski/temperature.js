var data = db.weather.aggregate({ $match: {} }, { $group: { _id: "$date", maxtemp: { $max:"$surface_temperature" } } }, {$sort: {_id: 1}}).result

function printCsvHeaders() {
  print("Date,Temperature")
}

function printCsv(record) {
  var csv = record._id + "," + record.maxtemp
  print(csv)
}
printCsvHeaders()
data.forEach(printCsv)
