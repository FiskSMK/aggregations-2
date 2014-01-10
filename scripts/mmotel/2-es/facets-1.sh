#ES facets search
#run : ./facets-1.sh

#aggregation 1

#top 10 users by activity

curl -X POST "http://localhost:9200/data/_search?pretty=true" -d '
{
    "query" : {
        "match_all" : {  }
    },
    "facets" : {
        "userId" : {
            "terms" : {
                "field" : "userId",
                "size" : 10
            }
        }
    }
}
' | jq . > facets-result-1.js