#ES facets search
#run : ./facets-2.sh

#aggregation 2

#users activity by months

curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {}
    },
    "facets" : {
        "histo1" : {
            "date_histogram" : {
                "field" : "timestamp",
                "interval" : "month"
            }
        }
    }
}
' | jq . > facets-result-2.js