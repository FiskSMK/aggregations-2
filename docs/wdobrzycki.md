# *Wojtek Dobrzycki*

Procesor :
model name      : Intel(R) Core(TM) i5 CPU       M 2760  @ 2.27GHz
###Zadanie 1a)
Pozbycie się białych znaków:
```sh
time cat Train.csv | replace "\n" " " | replace "\r" "\n" > TrainPrzerobiony.csv
```
Czas:
```
real    7m40.809s
user    3m17.495s
sys     0m57.287s
```
Import:
```sh
mongoimport --type csv -c Train --file TrainPrzerobiony.csv --headerline
```
```
real    62m22.013s
user    5m20.328s
sys     1m12.556s
```
![](../images/wdobrzycki/Zadanie.JPG)
###Zadanie 1b)
Zliczenie zaimportowanych rekordów.
```sh
> db.Train.count()
6034195
```
###Zadanie 1c)
Zamienić string zawierający tagi na tablicę napisów z tagami następnie zliczyć wszystkie tagi i wszystkie różne tagi. Napisać program, który to zrobi korzystając z jednego ze sterowników.
```js
baza = db.Train.find();

var tagsUnique = {};
var tagsNumber = 0;

baza.forEach(function(train){
    var tagsArray = [];
    if(typeof train.tags === "string") {
        tagsArray = train.tags.split(" ");
        db.Train.update({_id: train._id}, {$set: {tags: tagsArray}});
    } else if(typeof train.tags === "number") {
        tagsArray.push(train.tags.toString());
        db.Train.update({_id: train._id}, {$set: {tags: tagsArray}});
    } else {
        tagsArray = train.tags;
    }
    tagsNumber += tagsArray.length;
    tagsArray.forEach(function(tag) {
        if(typeof tagsUnique[tag] === "undefined")
            tagsUnique[tag] = 1;
    });
});
print("Wszystkie: " + tagsNumber);
print("Unikalne: " + Object.keys(tagsUnique).length);
```
```
Wszystkie: 17409994
Unikalne: 42048
```
Czas
```
real    36m17.261s
user    3m10.320s
sys     0m20.591s
```
###Zadanie 1d)
Po pobraniu i rozpakowaniu pliku text8.gz zabrałem się za import wpisów do bazy:
```sh
time mongoimport -c Text --type csv --file text8.txt --fields slowo
```
![](../images/wdobrzycki/Zadaniee.JPG)
Czas:
```
Wed Nov  6 10:10:34.179 			16979300	34651/second
Wed Nov  6 10:10:34.698 check 9 17005207
Wed Nov  6 10:10:35.329 imported 17005207 objects

real	8m11.334s
user	0m55.993s
sys	0m11.458s
```



Wszystkie i różne słowa:
```sh
konrad@Konrad:~/Pulpit$ mongo
MongoDB shell version: 2.4.8
connecting to: test
> db.Text.count()
17005207
> db.Text.distinct("slowo").length
253854
```
<<<<<<< HEAD

Najpopularniejsze słowo, jego ilość wystąpień oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1}
> ])
{ "result" : [ { "_id" : "the", "count" : 1061396 } ], "ok" : 1 }

> 1061396 / 17005207 * 100
6.241594118789616
```

Ilość wystąpień 10 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 10},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 4205965 } ], "ok" : 1 }

> 4205965 / 17005207 * 100
24.733394894869555
```

Ilość wystąpień 100 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 100},
> 	{$group: {_id: null, count: {$sum: "$count"}}},
> ])
{ "result" : [ { "_id" : null, "count" : 7998978 } ], "ok" : 1 }

> 7998978 / 17005207 * 100
47.03840417820259
```

Ilość wystąpień 1000 najpopularniejszych słów oraz udział procentowy w całym pliku:

```js
> db.text8.aggregate([
> 	{$group: {_id: "$word", count: {$sum: 1}}},
> 	{$sort: {count: -1}},
> 	{$limit: 1000},
> 	{$group: {_id: null, count: {$sum: "$count"}}}
> ])
{ "result" : [ { "_id" : null, "count" : 11433354 } ], "ok" : 1 }

> 11433354 / 17005207 * 100
67.23443001899359
```

---
=======
Najczęściej występujące słowo: było słowo *the*, które pojawiło się 1061396 razy oraz stanowi 6.24% całości. 
```sh
db.Text.aggregate(
        { $group: { _id: "$slowo", count: { $sum: 1 } } } , 
        { $sort: { count: -1 } }, 
        { $limit: 1 })
)
```
Najczęściej wystąpiło słowo 'the', stanowi 6.24% całości, co daje 1061396 wystąpień.

10 najczęściej występujących słów stanowi łącznie 25% wszystkich słów.
```sh
db.Text.aggregate(
        { $group: { _id: "$slowo", count: { $sum: 1 } } } ,
        { $sort: { count: -1 } },
        { $limit: 10 })
)
```
100 najczęściej występujących słów stanowi 47.04% wszystkich słów.
```sh
db.Text.aggregate(
        { $group: { _id: "$slowo", count: { $sum: 1 } } } ,
        { $sort: { count: -1 } },
        { $limit: 100 })
)
```
1000 najczęściej występujących słów stanowi 67.23% wszystkich słów.
```sh
db.Text.aggregate(
        { $group: { _id: "$slowo", count: { $sum: 1 } } } ,
        { $sort: { count: -1 } },
        { $limit: 1000 })
)
```
###Zadanie 1e)
    

	
	


>>>>>>> origin/master



