var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
var daysOfWeek = db.accidents.aggregate({ 
  $match: {} 
}, { 
  $group: { 
    _id: "$DayOfWeek", 
    count: { 
      $sum: 1 
    } 
  } 
}).result

function printCsvHeaders() {
  print("DayOfWeek,AccidentCount")
}

function printCsv(record) {
  var csv = days[record._id - 1] + "," + record.count

  print(csv)
}

daysOfWeek.forEach(printCsv)
