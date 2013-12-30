# *Przemysław Królik*

----

## Zadanie 2

Wykorzystałem bazę danych udostępnioną przez [GetGlue](http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz) umieszczoną na stronie [dr Włodzimierza Bzyla](http://wbzyl.inf.ug.edu.pl/nosql/).
Procesy importu danych pomijam jednakże warto zauważyć, że mongo importuje poprawnie ilość danych ``js imported 19831300 objects`` jednakże ElasticSearch ma problem z importem niektórych rekordów ``json {
    "count": 19766542,
    "_shards": {
        "total": 5,
        "successful": 5,
        "failed": 0
    }
}``