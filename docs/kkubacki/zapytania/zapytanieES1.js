curl -X POST "http://localhost:9200/concepts/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "iso_country" : {
            "terms" : {
                "field" : "iso_country",
                "size" : 5
            }
        }
    }
}
' | jq .