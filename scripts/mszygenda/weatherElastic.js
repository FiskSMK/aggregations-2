var elastic = require('./elasticHttp.js')

weatherFacet = {
    facets: {
      weather: { 
        terms: { 
          field: "Weather",
          order: "term"
        } 
      }
    }
}

countOfKnownWeather = {
  filtered: {
  filter: {
    not: {
      term: {
        Weather: "unknown"
      }
    }
  }
  }
}

elastic.post(elastic.searchUrl + "?search_type=count", weatherFacet, function (resp) {
  var weatherStats = resp.facets.weather.terms
  
  elastic.post(elastic.countUrl, countOfKnownWeather, function (resp) {
    weatherStats.push({
      term: "KnownWeather",
      count: resp.count
    })

    console.log(JSON.stringify(weatherStats))
  })
})

/*
curl -X POST "http://localhost:9200/accidents/_search?pretty=true" -d '
{
    "query" : { "query_string" : {"query" : "*"} },
    "facets" : {
      "tags" : { "terms" : {"field" : "Weather"} }
    }
}'

*/
