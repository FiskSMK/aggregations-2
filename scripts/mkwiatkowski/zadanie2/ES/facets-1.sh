curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '
{
    "query": {
        "match_all": {}
    },
    "facets": {
        "action": {
            "terms": {
                "field" : "action"
            }
        }
    }
}
' | jq . > facets-result-1.js