#Aleksandra Piasecka

##Wstęp:
parametry:
```
8GB ramu
Intel(R) Core(TM) i3-2130 CPU @ 3.40GHz
```

#Zadanie 1a
Aby pozbyć się niepotrzebnych `\n` skorzystałam z polecenia:
```
cat Train.csv |tr -d '\n'|sed 's/\r/\r\n/g' > TTrain.csv
```

a następnie tak przygotowany plik `.csv` zaimportowałam do mongo przy pomocy polecenia:
```
time mongoimport --collection Train --type csv --file TTrain.csv --headerline
```

###Czas:
```
real    8m16.170s
user    1m13.513s
sys     0m14.593s
```

#Zadanie 1b
```
db.Train.count();
6034195
```

#Zadanie 1d
Import do bazy:
```
time mongoimport --type csv --fields 'slowa' --collection text  --port 12121 < text8.txt 
```

```
Czas:
real        7m57.252s
user        0m46.171s
sys        0m5.532s
```

Ilość wszystkich słów:
```
wc -l text8.txt
17005207 text8.txt
```
lub
```
db.text.count();
17005207
```

###top1:
```
db.text.aggregate({$group: {_id: "$slowa", count: {$sum: 1}}}, {$sort: {count:-1}}, {$limit: 1})
{"result": [{"_id": "the", "count": 1061396}], "ok": 1}
```
```
całość: 17005207
wynik: 1061396
%: 6,24%
```

###top10:
```
db.text.aggregate(	{$group: {_id: "$slowa", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 10}, 
					{ $group: {_id: null, suma: {$sum: "$count"}}})
{ "result" : [ { "_id" : null, "suma" : 4205965 } ], "ok" : 1 }
```
```
całość: 17005207
wynik: 4205965
%: 24,7%
```

###top100:
```
db.text.aggregate(	{$group: {_id: "$slowa", count: {$sum: 1}}}, 
					{$sort: {count:-1}}, 
					{$limit: 10}, 
					{ $group: {_id: null, suma: {$sum: "$count"}}})
{ "result" : [ { "_id" : null, "suma" : 7998978 } ], "ok" : 1 }
```
```
całość: 17005207
wynik: 7998978
%: 47%
```