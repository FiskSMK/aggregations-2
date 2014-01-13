var badWeather = ["Fog", "Snow", "Rain"]
var totalCount = db.accidents.count({ Weather: { $ne: "Unknown" } })

var badWeatherAggregation = db.accidents.aggregate({ 
  $match: { 
    Weather: { $in: badWeather } 
  } 
}, { 
  $group: { 
    _id: "$Weather", 
    count: { 
      $sum: 1 
    } 
  } 
}, {
  $sort: {
    _id: 1
  }
})

function getCsvHeader() {
  return "Fog,Rain,Snow,BadWeather,TotalAccidentsWithKnownWeather"
}

function getResultCsv() {
  var result = badWeatherAggregation.result.map(function (r) { return r.count })
  var badWeatherCount = result.reduce(sum)

  result.push(badWeatherCount, totalCount)
  
  return result.join(",")
}

function sum(a, b) {
  return a + b
}

print(getCsvHeader())
print(getResultCsv())
