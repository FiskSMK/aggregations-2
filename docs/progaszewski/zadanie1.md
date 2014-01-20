# ZADANIE 1 #
## **1a)**  ##

Przygotowanie pliku do Tran.csv do zaimportowania do bazy mongoDB:

    time cat Train.csv | tr "\n" " " | tr "\r" "\n" > Train_unix.csv
    
    real 3m5.988s
    user 0m20.295s
    sys  0m22.091s

    cat Train_unix.csv | wc -l
    
    6034196 (z headerline)

Importowanie do bazy danych z pliku Train.unix.csv:

    time ./bin/mongoimport.exe -d nosql --type csv -c Train --file ./Train_unix.csv --headerline
    
    real 20m35.478s
    user 0m0.000s
    sys  0m0.015s

## **1b)** ##

Wkradł mi się pusty rekord:

> db.Train.find().sort({"Id":-1}).limit(1).pretty()
> 
> { "_id" : ObjectId("52b97b43836cfd155277839c"), "Id" : "" }

Usunołem go poleceniem:

    db.Train.remove( { "Id": ""}, 1)

dzięki temu am właśniwą ilość rekordów:

    db.Train.count()
    6034195

## **1c)** ##

Program napisany w języku Java, znajduje się [tutaj](/docs/progaszewski/NoSql.java).

Wykonywał się: **1870.518s** czyli około **32 minut**

## **1d)** ##
Plik text8.txt przygotowałem według treści zadania.

    time bin/mongoimport.exe -d nosql -type csv -f word -c text8 --file ./text8.txt
    
    real 19m16.996s
    user 0m0.000s
    sys  0m0.015s

    db.text8.count()
    17005207
    
    db.text8.distinct("word").length

Różnych słów jest 253854.

    db.text8.aggregate([ 
        {$group:{ _id:"$word", count:{$sum:1}}}, 
        {$sort: {count: -1}}, 
        {$limit:1} 
    ])
    
    { "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }
    1061396/17005207=0.0624

Najczęściej występujące słowo w tym pliku stanowi około 6,25% jego zawartości.

    db.text8.aggregate([ 
        {$group:{_id:"$word", ilosc:{$sum:1}}}, 
        {$sort: {ilosc: -1}}, 
        {$limit:10}, 
        {$group:{_id: null, ilosc:{$sum:"$ilosc"}}} 
    ])

    { "result" : [ { "_id" : null, "ilosc" : 4205965 } ], "ok" : 1 }
    4205965/17005207=0.2473

10 najczęściej występujących słów stanowi około 24,73% jego zawartości.

    db.text8.aggregate([ 
        {$group:{_id:"$word", ilosc:{$sum:1}}}, 
        {$sort: {ilosc: -1}}, 
        {$limit:10}, 
        {$group:{_id: null, ilsoc:{$sum:"$ilosc"}}} 
    ])

    { "result" : [ { "_id" : null, "ilosc" : 7998978 } ], "ok" : 1 }
    7998978/17005207=0.4704

100 najczęściej występujących słów stanowi około 47% jego zawartości.

    db.text8.aggregate([ 
        {$group:{_id:"$word", ilosc:{$sum:1}}}, 
        {$sort: {ilosc: -1}}, 
        {$limit:10}, 
        {$group:{_id: null, ilosct:{$sum:"$ilosc"}}} 
    ])

    { "result" : [ { "_id" : null, "ilosc" : 11433354 } ], "ok" : 1 }
    11433354/17005207=0.6723

1000 najczęściej występujących słów stanowi około 67% jego zawartości.
