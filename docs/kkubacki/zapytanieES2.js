curl -X POST "http://localhost:9200/concepts/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "municipality" : {
            "terms" : {
                "field" : "municipality",
                "size" : 5
            }
        }
    }
}
' | jq .