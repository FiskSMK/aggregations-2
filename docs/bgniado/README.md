##Parametry komputera:
Procesor Intel Core i3-2350M @ 2x2.30GHz
8 GB pamięci RAM

##Zadanie 1a:

"ogarnięcie" pliku Train.csv:
```
>cat Train.csv | tr -d '\n' | sed 's/\r/\r\n/g' > Train2.csv
```

po wykonaniu powyższego, zaimportowałem dane z pliku csv do bazy:
```
>time mongoimport --collection Train --type csv --file Train2.csv --headerline
```

###Czasy wykonania:
```
real    8m46.221s
user    1m33.419s
sys     0m15.073s
```

##Zadanie 1b
```
>db.Train.count();
>6034195
```
