Adrian Smykowski
Zadanie 2
#Sprzęt
```
PROC: Intel Core i7 - 4 rdzenie 
RAM: 8GB DDR3
DYSK: 40GB stary
```
#1. Wyszukać w sieci dane zawierające co najmniej 1_000_000 rekordów/jsonów.
```
Przyklad GetGlue z IMDB: http://getglue-data.s3.amazonaws.com/getglue_sample.tar.gz
```
#2. Dane zapisać w bazach MongoDB i Elasticsearch.
```
time mongoimport -d zad2 -c imdb --type json --file getglue_sample.json
```
```
Mon Jan 27 11:43:20.003                         19802300        16290/second
Mon Jan 27 11:43:20.004 check 9 19831300
Mon Jan 27 11:43:20.286 imported 19831300 objects
```
```
real    8m24.475s
user    3m5.031s
sys     0m6.550s
```
#3. Wymyśleć i opisać cztery agregacje – po dwie dla każdej z baz.

##Agregacja 1:

###Kod:

```
var result = db.zad2.aggregate(
  { $match: { "modelName": "movies" } },
  { $group: {_id: "$title", ilosc: {$sum: 1} } },
  { $sort: { ilosc: -1} },
  { $limit: 5}
);

printjson(result);
````
###Wynik:
```
{
        "result" : [
                {
                        "_id" : "The Twilight Saga: Breaking Dawn Part 1",
                        "ilosc" : 87527
                },
                {
                        "_id" : "The Hunger Games",
                        "ilosc" : 79343
                },
                {
                        "_id" : "Marvel's The Avengers",
                        "ilosc" : 64372
                },
                {
                        "_id" : "Harry Potter and the Deathly Hallows: Part II",
                        "ilosc" : 34001
                },
                {
                        "_id" : "The Muppets",
                        "ilosc" : 29002
                }
        ],
        "ok" : 1
}

```
##Agregacja 2:

###Kod:
```
var result = db.zad2.aggregate( 
    { $match: { "modelName": "movies"} },
    { $group: {_id: {"dir": "$director", id: "$title"}, count: {$sum: 1}} },
    { $group: {_id: "$_id.dir" , count: {$sum: 1}} },
    { $sort: {count: -1} },
    { $limit: 5}
    );

printjson(result);
```
###Wynik:
```
{
        "result" : [
                {
                        "_id" : "not available",
                        "count" : 1474
                },
                {
                        "_id" : "various directors",
                        "count" : 54
                },
                {
                        "_id" : "alfred hitchcock",
                        "count" : 50
                },
                {
                        "_id" : "michael curtiz",
                        "count" : 48
                },
                {
                        "_id" : "woody allen",
                        "count" : 47
                }
        ],
        "ok" : 1
}
```

#4. Zaprogramować i wykonać wszystkie aggregacje.

#5. Wyniki przedstawić w postaci graficznej (wykresów, itp.).
