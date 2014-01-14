# Karolina Rybarczyk
----


###Parametry komputera:
```
Time of this report: 12/30/2013, 16:04:01
       Machine name: KAROLINA-PC
   Operating System: Windows 7 Home Premium 64-bit (6.1, Build 7601) Service Pack 1 (7601.win7sp1_gdr.120330-1504)
           Language: Polish (Regional Setting: Polish)
System Manufacturer: LENOVO
       System Model: Lenovo IdeaPad Y580
               BIOS: InsydeH2O Version 03.71.515DCN38WW(V2.05)
          Processor: Intel(R) Core(TM) i7-3630QM CPU @ 2.40GHz (8 CPUs), ~2.4GHz
             Memory: 16384MB RAM
Available OS Memory: 16286MB RAM
          Page File: 3997MB used, 28573MB available
        Windows Dir: C:\Windows
    DirectX Version: DirectX 11
DX Setup Parameters: Not found
   User DPI Setting: Using System DPI
 System DPI Setting: 120 DPI (125 percent)
    DWM DPI Scaling: UnKnown
     DxDiag Version: 6.01.7601.17514 32bit Unicode

```

###Wersja Mongo:
```
MongoDB shell version: 2.4.8
```
----

## Temat: Waga oraz wzrost ankietowanych.

###Przygotowanie danych:

Dane zostały wygenerowane z pomocą serwisu http://www.json-generator.com/
Serwis ten działa świetnie do pewnego momentu - jeżeli będziemy próbowali wytworzyć za dużo danych na raz, po prostu się zawiesi. Dlatego wytworzyłam 10 paczek danych, każda po 100 000 elementów. Na działanie skryptu wpływa też ilość danych w pojedynczym rekordzie, więc z góry musiałam się ograniczyć do niezbędnych mi danych, stąd nie potrzebowałam Google Refine.
Usunęłam również z moich jsonów wartość "_id". Każda z paczek zaczynałaby się od _id=0, przez co jest ono totalnie nieużyteczne. Usuwając "_id" z jsonów generowanie id zrzuciłam na barki Mongo, który świetnie sobie z tym poradził.

Wygląd wzorcowego jsona, wykorzystanego do generowania danych:
![screenshot.png](https://github.com/K-J-Rybarczyk/aggregations-2/raw/master/images/krybarczyk/Generator.jpg "Generator")


###Wgranie danych (dla Mongo):

Przygotowane pliki wgrywałam jedna po drugiej za pomocą mongoimport (połączenie plików w jeden niestety nie wyszło, plik wyjściowy nie chciał się importować).

```
mongoimport --collection ludzie --type json --file 1.json --jsonArray
```
Dzięki --jsonArray, mongoimport był w stanie zimportować dosyć charakterystyczne pliki, jakie wytwarza json-generator.

Po wgraniu pierwszego pliku:
![screenshot.png](https://github.com/K-J-Rybarczyk/aggregations-2/raw/master/images/krybarczyk/1.jpg "1")
Nie użyłam opcji "time" (ze względu na ilość plików) ale całość importu trwała około godziny. Już po imporcie weszłam do bazy i kazałam mu sprawdzić, czy wgrał wszystko i czy liczba elementów wynosi 1 000 000.
![screenshot.png](https://github.com/K-J-Rybarczyk/aggregations-2/raw/master/images/krybarczyk/Count.jpg "Count")


###Agregacje (dla Mongo):


Przykładowy ankietowyany (uzyskany z pomocą db.ludzie.findOne()):

```
{
        "_id" : ObjectId("52c17370c1fc96f545875989"),
        "name" : "Emma Cervantes",
        "gender" : "female",
        "age" : 22,
        "weight" : 83,
        "size" : 171
}
```


#####Agregacja pierwsza:

(uwaga - jako, że dane są losowe, wyniki mogą wydawać się lekko bezsensu, szczególnie dotyczące średnich, które nie mają wiele wspólnego z rzeczywistością)


5 kobiet, od najcięższej, ważących 90 lub mniej kilogramów (ograniczone do pierwszych 5 osobników):


```
db.ludzie.aggregate(
   [
     { $match : {gender: "female" } },
     { $group : { _id :"$_id", weight:{$sum:"$weight"}}},
     { $sort : { weight : -1 } },
     {$match:{weight:{$lte:90}}},
     { $limit : 5 }
   ]
 )
```


wynik:



```
{
        "result" : [
                {
                        "_id" : ObjectId("52c18958c1fc96f545969b4b"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969b50"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f5459696bf"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969a30"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969b5f"),
                        "weight" : 90
                }
        ],
        "ok" : 1
}

```


5 mężczyzn, od najcięższego, ważących 90 lub mniej kilogramów (ograniczone do pierwszych 5 osobników):



```
db.ludzie.aggregate(
   [
     { $match : {gender: "male" } },
     { $group : { _id :"$_id", weight:{$sum:"$weight"}}},
     { $sort : { weight : -1 } },
     {$match:{weight:{$lte:90}}},
     { $limit : 5 }
   ]
 )
```


wynik:


```
{
        "result" : [
                {
                        "_id" : ObjectId("52c18958c1fc96f5459699fc"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969b2f"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969442"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969a61"),
                        "weight" : 90
                },
                {
                        "_id" : ObjectId("52c18958c1fc96f545969b5f"),
                        "weight" : 90
                }
        ],
        "ok" : 1
}

```


#####Agregacja druga:


Średnia waga mężczyzn względem wzrostu (ograniczone do 5 największych wag):

```
db.ludzie.aggregate(
   [
     { $match : {gender: "male" } },
     { $group : { _id : {size: "$size"}, weight:{$avg:"$weight"}}},
     { $group : { _id : "$_id.size", avgKG:{$avg:"$weight"}}},
     { $sort : { avgKG : -1 } },
     { $limit : 5 }
   ]
 )
```

wynik:

```
{
        "result" : [
                {
                        "_id" : 192,
                        "avgKG" : 83.19584874640361
                },
                {
                        "_id" : 151,
                        "avgKG" : 83.17347772782999
                },
                {
                        "_id" : 187,
                        "avgKG" : 83.1038961038961
                },
                {
                        "_id" : 153,
                        "avgKG" : 83.05527638190955
                },
                {
                        "_id" : 210,
                        "avgKG" : 83.0410152284264
                }
        ],
        "ok" : 1
}
```



Średnia waga kobiet względem wzrostu (ograniczone do 5 największych wag):

```
db.ludzie.aggregate(
   [
     { $match : {gender: "female" } },
     { $group : { _id : {size: "$size"}, weight:{$avg:"$weight"}}},
     { $group : { _id : "$_id.size", avgKG:{$avg:"$weight"}}},
     { $sort : { avgKG : -1 } },
     { $limit : 5 }
   ]
 )
```

wynik:

```
{
        "result" : [
                {
                        "_id" : 183,
                        "avgKG" : 83.11077481840194
                },
                {
                        "_id" : 141,
                        "avgKG" : 83.00561688940539
                },
                {
                        "_id" : 144,
                        "avgKG" : 82.98055842812823
                },
                {
                        "_id" : 142,
                        "avgKG" : 82.96642685851319
                },
                {
                        "_id" : 130,
                        "avgKG" : 82.9654286843145
                }
        ],
        "ok" : 1
}
```