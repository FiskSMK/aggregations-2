### *Piotr Malinowski*

----

### *Konfiguracja sprz�tu*

Procesor Intel i5-3350P 3.7Ghz
Dysk Intel SSD 330 60 GB
Pami�� 8GB DDR3

Windows 7 Professional x64 sp1
MongoDB shell version: 2.4.9
�rodowisko Cygwin

## Zadanie 1
### a) Import Train.csv do MongoDB

Plik zmodyfikowany skryptem 2unix.sh naprawiaj�cym z�amane wiersze.

import poleceniem
```
time mongoimport --type csv -c Train --file ./Train2.csv --headerline
```
img import

### b) Zliczanie rekordow

img count

### c) Zmiana formatu tagow i update

[W�asny skrypt](../../scripts/pmalinowski/tagtotab.js) node.js przy uzyciu natywnego drivera mongodb.
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
####Ilosc r�nych s��w
```
db.words.distinct("word").length
253854
```
####Najcz�stsze s�owo
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
dla r�nych limit�w daje wynik

|Limit	| Ilo�� s��w	| Udzia� %	|      
|:-----------|------------:|:---------:|
| 1	|1061396	| 6.24%	|      
| 10	|4205965 	| 24.73%	|
| 100	|7998978	| 47%	 |
| 1000	|11433354	| 67%       |
