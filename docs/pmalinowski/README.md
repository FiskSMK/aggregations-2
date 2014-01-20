### *Piotr Malinowski*

----

### *Konfiguracja sprzêtu*

Procesor Intel i5-3350P 3.7Ghz
Dysk Intel SSD 330 60 GB
Pamiêæ 8GB DDR3

Windows 7 Professional x64 sp1
MongoDB shell version: 2.4.9
Œrodowisko Cygwin

## Zadanie 1
### a) Import Train.csv do MongoDB

Plik zmodyfikowany skryptem 2unix.sh naprawiaj¹cym z³amane wiersze.

import poleceniem
```
time mongoimport --type csv -c Train --file ./Train2.csv --headerline
```
img import

### b) Zliczanie rekordow

img count

### c) Zmiana formatu tagow i update

[W³asny skrypt](../scripts/pmalinowski/tagtotab.js) node.js przy uzyciu natywnego drivera mongodb.
img tagi
img efekt
### d)

Dane przygotowane wg opisu zadania zimportowane
```
mongoimport  -c words --type csv -f word text8.txt
```

####Ilosc slow
```
db.words.count()
17005207
```
####Ilosc ró¿nych s³ów
```
db.words.distinct("word").length
253854
```
####Najczêstsze s³owo
```
db.words.aggregate(
		{ $group: { _id: "$word", count: { $sum: 1 } } } , 
		{ $sort: { count: -1 } }, 
		{ $limit: 1})
"the"  1061396 
```
###Procentowy udzial
```
db.words.aggregate([ {$group:{_id:"$word", count:{$sum:1}}},
	{$sort: {count: -1}},
	{$limit:100}, 
	{$group:{_id: null, count:{$sum:"$count"}}} 
])
```
dla ró¿nych limitów daje wynik

|Limit	| Iloœæ s³ów	| Udzia³ %	|      
|:-----------|------------:|:---------:|
| 1	|1061396	| 6.24%	|      
| 10	|4205965 	 24.73%	|
| 100	|7998978	| 47%	 |
| 1000	|11433354	| 67%       |
