var elastic = require('./elasticHttp.js')

var daysOfWeekFacet = {
  facets: {
    daysOfWeek: { 
      terms: {
        field: "DayOfWeek"
      } 
    }
  }
}

elastic.post(elastic.searchUrl + "?search_type=count", daysOfWeekFacet, function (resp) {
  var daysOfWeek = resp.facets.daysOfWeek.terms.map(function (record) {
    return {
      day: getDayStr(record.term),
      count: record.count
    }
  })

  console.log(JSON.stringify(daysOfWeek)) 
})

function getDayStr(dayNum) {
  var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  
  return days[parseInt(dayNum) - 1]
}

/*
curl -X POST "http://localhost:9200/accidents/_search?pretty=true" -d '
  {
    "query" : { "query_string" : {"query" : "*"} },
    "facets" : {
      "tags" : { "terms" : {"field" : "DayOfWeek"} }
    }
  }'
*/
