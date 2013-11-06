Paweł Sawicki
--
```
4rdzenie/4gb ram
```
MongoDB - 2.4.6
==

1a
--

```sh
time mongoimport --db baza --collection train < train.json

Sun Nov  3 12:34:09.484 check 9 6034195
Sun Nov  3 12:34:10.242 imported 6034195 objects

real    8m44.261s
user	2m45.736s
sys	 0m20.934s
```

1b
--


```sh
>use train
db.train.count()
6034195
```

1c
--

Zamiana w Mongo
Sprawdzenie czy pole z tagami jest tablica, nastepnie stworzenie tablicy na rozdzielone tagi oraz przydzielenie tagow do tablicy.
```sh
if(item.Tags.constructor !== Array){  
  var tagss = [];
  if(item.Tags.constructor === String){
    var tagss = item.Tags.split(" ");
  } else {
    tagss.push(item.Tags);
  }
  item.Tags = tagss;
}
```
wynik skryptu
```sh
obj 6034195
updates 6034195
ntags 17409994
tags 42048

real    8m39.473s
user    2m53.412s
sys     0m5.644s
```

1d
--

Skrypt zmieniajacy text8 na text8.json
```sh
cat stjs.sh
sed "s/ /\" }\n{ \"word\" : \"/g" text8 > text8.json
sed -i '1s/^/{ \"word\":\"/' text8.json
sed -i '$s/$/\" }/' text8.json
./stjs.sh
time bash stjs.sh
real    1m54.930s
user	0m22.224s
sys	1m22.104s
```
Po przygotowaniu pliku text8.txt zgodnie ze wskazówką z treści zadania.
```sh
time mongoimport -d text -c text --type csv --fields 'word' --file text8.txt 

Sun Nov  3 15:45:09.484 check 9 17005207
Sun Nov  3 15:45:10.242 imported 17005207 objects

real	7m52.961s
user	0m45.736s
sys	0m9.984s
```
![htop](http://savikk.boo.pl/UG/nosql/htop1.png)
Sprawdzenie
--
```sh
db.text.count()
17005207
db.text.distinct("word").length
253854
```
Najpopularniejszy wyraz
```sh
> db.text.aggregate(
    [
      { $group : { _id : "$word" , liczba : { $sum : 1 } } },
      { $sort : { liczba : -1 } },
      { $limit : 1 }
    ]
  )

{ "result" : [ { "_id" : "the", "liczba" : 1061396 } ], "ok" : 1 }
1061396 z 17005207 to 6.24159411878962%
```
10 najpopularniejszych wyrazów
```sh
> db.text.aggregate(
    [
      { $group : { _id : "$word" , liczba : { $sum : 1 } } },
      { $sort : { liczba : -1 } },
      { $limit : 1000 },
      { $group : { _id : "1000", zlicz: { $sum : "$liczba" } } }
    ]
  )
```
Zmianie ulega tylko limit 10/100/100
```sh
 { "result" : [ { "_id" : "10", "zlicz" : 4205965 } ], "ok" : 1 }
 4205965 z 17005207 to 24.7333948948696%
 
{ "result" : [ { "_id" : "100", "zlicz" : 7998978 } ], "ok" : 1 }
7998978 z 17005207 to 47.0384041782026%

{ "result" : [ { "_id" : "1000", "zlicz" : 11433354	}],	"ok" : 1 }
11433354 z 17005207 to  67.2344300189936%

```

