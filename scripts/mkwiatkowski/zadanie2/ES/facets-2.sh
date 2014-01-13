curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '
{
    "query": {
        "match_all": {}
    },
    "facets": {
        "modelName": {
            "terms": {
                "field" : "modelName",
                "size": "10"
            }
        }
    }
}
' | jq . > facets-result-2.js