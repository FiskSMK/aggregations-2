#Aleksandra Piasecka

##Wstęp:
parametry komputera:
8GB ramu
Intel(R) Core(TM) i3-2130 CPU @ 3.40GHz

#Zadanie 1a
Aby pozbyć się niepotrzebnych `\n` skorzystałam z polecenia:
```
cat Train.csv |tr -d '\n'|sed 's/\r/\r\n/g' > TTrain.csv
```

a nastepnie taki plik .csv zaimportowałam do mongo przy pomocy polecenia:
```
time mongoimport --collection Train --type csv --file TTrain.csv --headerline
```

###Czas:
```
real    8m16.170s
user    1m13.513s
sys     0m14.593s
```