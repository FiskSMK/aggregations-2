ZADANIE PIERWSZE

1A

Na poczatek trzeba przygotowac plik csv to importu mozna zrobic to na wiele sposobow ja skorzystalem z opcji cat 
```
cat Train.csv | tr "\n" " " | tr "\r" "\n" | head -n 6034196 > Train_new.csv
```
nastepnie importujemy plik csv za pomocoa mongoimport 
```
time mongoimport -db pociagi -collection pociagi --type csv --headerline --ignoreBlanks --file Train_new.csv
connected to: 127.0.0.1
```
```
Fri Nov  1 19:31:30.002                 Progress: 71591479/7253917399   0%
Fri Nov  1 19:31:30.002                         59600   19866/second
Fri Nov  1 19:31:33.065                 Progress: 129534065/7253917399  1%
Fri Nov  1 19:31:33.065                         108000  18000/second.
.            
Fri Nov  1 19:38:09.057                 Progress: 7157250651/7253917399 98%
Fri Nov  1 19:38:09.058                         5953900 14810/second
Fri Nov  1 19:38:12.006                 Progress: 7224966741/7253917399 99%
Fri Nov  1 19:38:12.006                         6010200 14840/second
Fri Nov  1 19:38:13.205 check 9 6034196
Fri Nov  1 19:38:13.413 imported 6034195 objects
```
real    6m46.230s
user    1m41.986s
sys     0m13.001s



1B

Za pomoca funkcji db.nazwa.count() zliczamy ilosc wierszy
```
mongo
MongoDB shell version: 2.4.7
connecting to: test
use pociagi
switched to db pociagi
db.pociagi.count()
6034195
```



1D

Przygotowalem plik zgodnie z opisem na stronie z laboratoriami pozniej zamienilem plik txt na csv z pomoca funkcji sed
```
sed 1d text8.txt | sed '1s/^/word\n/' > text8.csv
```
```
time mongoimport -db tekst -collection tekst --type csv --headerline --ignoreBlanks --file text8.csv
```
```
connected to: 127.0.0.1

Fri Nov  1 20:25:45.019                 Progress: 424872/100000004      0%
Fri Nov  1 20:25:45.019                         71400   23800/second
Fri Nov  1 20:25:48.110                 Progress: 1025144/100000004     1%
Fri Nov  1 20:25:48.110                         171500  28583/second
.
Fri Nov  1 20:34:59.052                 Progress: 98934515/100000004    98%
Fri Nov  1 20:34:59.052                         16824400        30205/second
Fri Nov  1 20:35:02.087                 Progress: 99571918/100000004    99%
Fri Nov  1 20:35:02.088                         16933500        30238/second
Fri Nov  1 20:35:03.992 check 9 17005208
Fri Nov  1 20:35:04.205 imported 17005207 objects
```

real    9m21.440s
user    0m50.667s
sys     0m8.109s

```
MongoDB shell version: 2.4.7
connecting to: test
use tekst
switched to db tekst
db.tekst.count()
17005207
db.tekst.distinct("word").length
253854
```

Do zliczenia slow uzyjemy frameworka do agregacji w mongodb
```
db.tekst.aggregate([ 
    {$group:{ _id:"$word", count:{$sum:1}}}, 
    {$sort: {count: -1}}, 
    {$limit:10} // ustawiamy liczbe slow 10-100-1000
])
```
```
10 slow stanowi 24,7%
100 slow stanowi 47%
1000 slow stanowi 67,2%
```

Podczas importu
[1](../images/aelszkowski/podaczasimportu.png)
[2](../images/aelszkowski/podaczasimportu1.png)

