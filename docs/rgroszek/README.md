##Rafał Groszek

##Zad 1a:
Należało zaimportować plik Train.csv do bazy 

Jeśli chcemy zaimportować plik Train.csv do bazy mongodb najpierw musimy go "oczyścić" poleceniem:
```
>cat Train.csv | tr -d '\n' | sed 's/\r/\r\n/g' > Train2.csv
```

następnie importujemy plik do bazy mongodb
```
>time mongoimport --collection Train --type csv --file Train2.csv --headerline
```

###Czas:
```
real 10m31.324s
user 1m53.519s
sys 0m16.053s
```

#Zad 1b 
Zliczyć liczbę zaimportowanych rekordów
```
>db.Train.count()​;
>6034195
```