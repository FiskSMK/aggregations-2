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
